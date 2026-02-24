"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { Camera, MapPin, X, Loader2, CheckCircle, ShieldCheck, Sparkles, Activity, Zap, Shield, ArrowRight } from "lucide-react";

export default function GarbageReportPage() {
  const { user } = useUser();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");

  const isMobile = typeof window !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile ? { exact: "environment" } : "user",
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    setPhotos([{ localURL: imageData, uploadedURL: null }]);
    stopCamera();
    await uploadToCloudinary(imageData);
  };

  const uploadToCloudinary = async (base64Image) => {
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
    formData.append("folder", "garbage_reports");

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      setLoading(false);
      setProgress(0);

      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setPhotos((prev) =>
          prev.map((p) => ({ ...p, uploadedURL: res.secure_url }))
        );
      }
    };

    xhr.onerror = () => {
      setLoading(false);
    };

    xhr.send(formData);
  };

  const removeImage = () => {
    setPhotos([]);
    startCamera();
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: position.address || "Localized Vector Alpha"
          });
        },
        reject
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedImages = photos
      .filter((p) => p.uploadedURL)
      .map((p) => p.uploadedURL);

    if (uploadedImages.length === 0)
      return alert("⏳ Establishing telemetry link... Please wait for upload.");

    setLoading(true);

    try {
      const validationRes = await fetch("/api/validateImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploadedImages[0] }),
      });

      const validationData = await validationRes.json();

      if (!validationData.isGarbage) {
        setLoading(false);
        return alert("⚠️ Protocol Mismatch: Image does not contain valid civic instability data.");
      }

      const loc = await getCurrentLocation();
      setLocation(loc);

      const res = await fetch("/api/garbage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "Anonymous Operative",
          email: user?.email || "N/A",
          message,
          address: loc.address,
          location: { lat: loc.lat, lng: loc.lng },
          images: uploadedImages,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        alert("✅ Signal Transmitted: Civic data integrated into Nexus.");
        setPhotos([]);
        setMessage("");
        startCamera();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("❌ Transmission Failure: Core signal lost.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background text-foreground pt-5 md:pt-32 px-4 md:px-6 pb-24 md:pb-24 relative overflow-hidden font-sans">

        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[100%] md:w-[60%] h-[60%] bg-accent/10 rounded-full blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[100%] md:w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">

          {/* Header Section */}
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-4 md:mb-6 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent-secondary">
              <Sparkles size={14} /> Capture garbage
            </div>
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-2 md:mb-4 tracking-tight">
              City <span className="text-gradient">Scanner</span>
            </h1>
            {/* <p className="text-zinc-500 text-sm md:text-lg font-medium max-w-xl mx-auto">
              Synthesize and transmit real-time thermal and structural data for rapid urban sanitization.
            </p> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

            {/* Camera Viewport Container */}
            <div className="relative group">
              <div className="absolute -inset-1 md:-inset-1.5 bg-gradient-to-r from-accent/30 to-accent-secondary/30 rounded-[2rem] md:rounded-[3rem] blur-sm md:blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>

              <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl aspect-[4/3] md:aspect-[16/10]">

                {photos.length === 0 ? (
                  <div className="relative h-full w-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover brightness-75 contrast-[1.1] "
                    />

                    {/* HUD Overlay */}
                    <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 m-4 md:m-6 rounded-[1.2rem] md:rounded-[2rem]">
                      <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-l-2 border-accent" />
                      <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-accent" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-accent" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b-2 border-r-2 border-accent" />

                      {/* Scanning Line */}
                      <div className="absolute left-0 right-0 top-0 h-0.5 bg-accent/30 animate-[scan_3s_ease-in-out_infinite] shadow-[0_0_15px_rgba(99,102,241,0.5)]" />

                      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 glass px-3 md:px-4 py-1.5 md:py-2 rounded-full border-white/10 whitespace-nowrap">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        <span className="text-[8px] md:text-[10px] font-black text-white/80 tracking-[0.3em] uppercase">Telemetry Alpha</span>
                      </div>

                      <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 flex justify-between items-end">
                        <div className="space-y-1.5 md:space-y-2 opacity-60">
                          <div className="flex items-center gap-2 text-[7px] md:text-[8px] font-black text-white/40 tracking-widest"><Zap size={10} /> POS_LOCK</div>
                          <div className="flex items-center gap-2 text-[7px] md:text-[8px] font-black text-white/40 tracking-widest"><Shield size={10} /> ENC_VERIFY</div>
                        </div>
                        <div className="text-[7px] md:text-[8px] font-black text-white/40 tracking-[0.4em] uppercase tabular-nums">{new Date().toLocaleTimeString([], { hour12: false })}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-accent/40 border-[6px] md:border-8 border-black group/btn"
                    >
                      <Camera size={28} className="md:w-8 md:h-8 group-hover/btn:rotate-12 transition-transform duration-500" />
                    </button>
                  </div>
                ) : (
                  <div className="relative h-full w-full bg-zinc-950">
                    <img
                      src={photos[0].localURL}
                      className="w-full h-full object-contain opacity-80"
                      alt="Captured Preview"
                    />

                    {/* Upload Overlay */}
                    {loading && progress > 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="w-40 md:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 md:mb-6">
                          <div className="h-full bg-accent transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-accent animate-pulse">Syncing Nexus: {progress}%</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 md:top-6 right-4 md:right-6 bg-black/60 backdrop-blur-md border border-white/10 p-3 md:p-3.5 rounded-xl md:rounded-2xl hover:bg-red-500 hover:text-white transition-all scale-100 md:scale-110 active:scale-90"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5"  />
                    </button>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            {/* Form Details */}
            <div className="space-y-4 md:space-y-6">
              <div className="relative group">
                <textarea
                  placeholder="Synthetic analysis of site instability (e.g., Waste overflow, structural hazard details)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 md:h-40 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] glass border-white/5 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all outline-none text-sm md:text-base font-medium placeholder:text-zinc-700 leading-relaxed shadow-xl"
                />
              </div>

              {/* <div className="flex items-start gap-3 md:gap-4 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] glass border-accent/10 bg-accent/5">
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] md:text-xs text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">
                  Neural location vectors and imagery tokens are cryptographically signed and routed to relevant infrastructure nodes.
                </p>
              </div> */}
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs transition-all duration-700 relative overflow-hidden group shadow-xl active:scale-95 ${loading
                ? "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5"
                : "premium-button text-white"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={18} /> Processing Transmission...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Confirm Transmission <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0% }
          50% { top: 100% }
          100% { top: 0% }
        }
      `}</style>
    </>
  );
}