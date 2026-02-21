"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { Camera, MapPin, X, Loader2, CheckCircle, ShieldCheck, Sparkles } from "lucide-react";

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
            address: position.address
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
      return alert("⏳ Please capture and upload image first!");

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
        return alert("⚠️ Image is not garbage related!");
      }

      const loc = await getCurrentLocation();
      setLocation(loc);

      const res = await fetch("/api/garbage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "Anonymous",
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
        alert("✅ Report submitted!");
        setPhotos([]);
        setMessage("");
        startCamera();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("❌ Error occurred!");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#050505] text-white pt-28 px-4 pb-24 relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/10 blur-[120px] -z-10" />

        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">AI-Verified Reporting</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Field Scanner</h1>
            <p className="text-zinc-500 text-sm font-medium">Capture and transmit urban sanitation data in real-time.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Camera Viewport Container */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl aspect-video md:aspect-[16/10]">

                {photos.length === 0 ? (
                  <div className="relative h-full w-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover brightness-75 contrast-125"
                    />
                    
                    {/* HUD Overlay */}
                    <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 m-4 rounded-xl">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />
                      
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-mono font-bold text-white/40 tracking-[0.3em] uppercase">REC-DATA_STREAM</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] border-4 border-black"
                    >
                      <Camera size={28} />
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
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Uploading: {progress}%</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            {/* Form Details */}
            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  placeholder="Detail the issue (e.g., Overflowing waste bin, hazardous material)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 p-5 rounded-2xl bg-zinc-900/50 border border-white/5 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-sm font-medium placeholder:text-zinc-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed uppercase tracking-wider">
                  Coordinates and high-fidelity imagery are automatically bundled for departmental verification.
                </p>
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 relative overflow-hidden group ${
                loading 
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                : "bg-emerald-500 text-black hover:bg-emerald-400 hover:translate-y-[-2px] shadow-[0_10px_30px_rgba(16,185,129,0.2)] active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} /> Encrypting Payload...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} className="group-hover:scale-125 transition-transform" /> Transmit Signal
                </span>
              )}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}