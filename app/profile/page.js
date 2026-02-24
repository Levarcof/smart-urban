"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, Trash2, MapPin, FileText, X, Sparkles, Activity, Shield, Camera, Edit2, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useUser();

  const [reports, setReports] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("routes");

  // ✅ IMAGE PREVIEW STATE
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ DELETE CONFIRM MODAL STATE
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const getReportApi = () => {
    if (activeTab === "routes") return "/api/myReport/road";
    if (activeTab === "garbage") return "/api/myReport/garbage";
  };

  const getDeleteApi = () => {
    if (activeTab === "routes") return "/api/report/solve";
    if (activeTab === "garbage") return "/api/garbage/solve";
  };

  useEffect(() => {
    if (!user?.email) return;

    async function fetchReports() {
      try {
        const res = await fetch(getReportApi(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        console.log(err);
      }
    }

    fetchReports();
  }, [user, activeTab]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToCloudinary = async () => {
    if (!file) return image;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_NAME);

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      setUploading(false);
      return json.secure_url;
    } catch (error) {
      setUploading(false);
      console.error("Cloudinary Upload Error:", error);
      alert("❌ Authentication failed: Imagery uplink offline.");
      return "";
    }
  };


  const updateProfile = async () => {
    setLoading(true);
    const imageUrl = await uploadToCloudinary();
    try {
      const res = await fetch("/api/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl, email }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditMode(false);
        alert("Personal core data updated.");
      } else {
        alert("Update rejected by central node.");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const openDeleteModal = (rep) => {
    setSelectedReport(rep);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedReport) return;

    try {
      const res = await fetch(getDeleteApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedReport._id, email: user.email }),
      });

      const data = await res.json();
      if (data.success) {
        setReports(data.allReports || []);
      } else {
        alert("Action restricted.");
      }
    } catch (error) {
      console.log(error);
    }

    setDeleteModal(false);
    setSelectedReport(null);
  };

    const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        setUser(null)
        router.push("/login")
        setShowProfile(false)
      }
    } catch (error) {
      console.log("Logout error:", error)
    }
  }
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <Navbar />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[100%] md:w-[60%] h-[60%] bg-accent/10 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[100%] md:w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-5 md:pt-32 pb-24">

        {/* HEADER SECTION */}
        <div className="text-center mb-4 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-4 md:mb-6 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent-secondary">
            <Sparkles size={14} /> Operative Profile Interface
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight md:mb-3">
            Citizen <span className="text-gradient">Identity</span>
          </h1>
          {/* <p className="text-zinc-500 text-sm md:text-lg font-medium max-w-xl mx-auto">
            Synchronizing personal core data with regional civic authorization nodes.
          </p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* LEFT: IDENTITY CARD */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            <div className="glass-card p-8 md:p-10 border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/50 to-transparent opacity-30" />

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 md:mb-8 group/avatar">
                  <div className="absolute -inset-2 bg-gradient-to-r from-accent to-accent-secondary rounded-full blur opacity-20 group-hover/avatar:opacity-40 transition duration-700" />
                  <img
                    src={image || "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=6366f1&color=fff"}
                    alt="identity-token"
                    className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-black object-cover shadow-2xl transition-transform duration-700 group-hover/avatar:scale-105"
                  />
                  <button
                    onClick={() => setEditMode(true)}
                    className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-accent text-white p-2 md:p-2.5 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-black"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-1">{user?.name || "Operative Zero"}</h2>
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] md:text-sm font-black uppercase tracking-widest mb-8 md:mb-10">
                  <Shield size={14} className="text-accent" /> Email ID: {user?.email}
                </div>

                <div className="w-full grid grid-cols-2 gap-3 md:gap-4">
                  <div className="glass-card p-3 md:p-4 border-white/5 bg-white/[0.02]">
                    <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Cores Synced</p>
                    <h3 className="text-xl md:text-2xl font-black text-white tabular-nums">{reports.length}</h3>
                  </div>
                  <div className="glass-card p-3 md:p-4 border-white/5 bg-white/[0.02]">
                    <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Status</p>
                    <h3 className="text-[10px] md:text-sm font-black text-emerald-400 uppercase tracking-widest">AUTHORIZED</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 md:p-6 border-white/5 bg-accent/5 flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Activity size={20} className="md:size-6" />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-widest text-[10px] md:text-sm">Real-time Biometry</h4>
                <p className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Uplink Stable • 72 BPM</p>
              </div>
            </div>
          </div>

          {/* RIGHT: DATA FEED */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">

            {/* TABS ENGINE */}
            <div className="glass-card p-1.5 md:p-2 border-white/5 flex overflow-x-auto scrollbar-hide gap-1 md:gap-2 no-scrollbar">
              {[
                { key: "routes", label: "Neural Routes", icon: <MapPin size={16} /> },
                { key: "garbage", label: "Civic Flux", icon: <Trash2 size={16} /> },
                { key: "settings", label: "System Config", icon: <Settings size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${activeTab === tab.key
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-zinc-500 hover:text-white"
                    }`}
                >
                  {tab.icon} {tab.label.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* CONTENT ENGINE */}
            {activeTab !== "settings" ? (
              <div className="min-h-[400px]">
                {reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 md:py-40 glass rounded-[2.5rem] border-white/5 text-center px-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 flex items-center justify-center text-zinc-800 mb-6">
                      <FileText size={32} />
                    </div>
                    <h3 className="text-sm md:text-lg font-black text-zinc-600 uppercase tracking-[0.2em]">Zero Data Points</h3>
                    <p className="text-zinc-700 text-xs md:text-sm mt-2 font-bold max-w-xs">No active reports synchronized within this node vector.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {reports.map((rep, i) => (
                      <div
                        key={i}
                        className="glass-card border-white/5 overflow-hidden group hover:border-accent/30 transition-all duration-500 flex flex-col active:scale-[0.98]"
                      >
                        {activeTab === "garbage" && rep.images?.[0] && (
                          <div className="w-full h-40 md:h-48 overflow-hidden relative">
                            <img
                              src={rep.images[0]}
                              alt="sensor-capture"
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-700 cursor-pointer"
                              onClick={() => setPreviewImage(rep.images[0])}
                            />
                            <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white">Capture Alpha</div>
                          </div>
                        )}

                        <div className="p-5 md:p-6 flex-1 flex flex-col">
                          <h3 className="font-bold text-base md:text-lg text-white mb-2 leading-tight group-hover:text-accent transition-colors italic">
                            "{rep.message}"
                          </h3>

                          <div className="flex items-start gap-2 text-zinc-500 text-[11px] md:text-xs font-bold mb-4 flex-1">
                            <MapPin size={14} className="text-accent shrink-0 mt-0.5" /> {rep.address}
                          </div>

                          <div className="flex items-center justify-between pt-5 border-t border-white/5">
                            <div className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest tabular-nums">
                              {new Date(rep.createdAt).toLocaleString([], { hour12: false })}
                            </div>
                            {/* <button
                              onClick={() => openDeleteModal(rep)}
                              className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all active:scale-90 shadow-lg"
                            >
                              <Trash2 size={16} />
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="glass-card p-8 md:p-10 border-white/5 space-y-8 md:space-y-10">
                  <div>
                    <h4 className="text-white font-black text-lg md:text-xl mb-2 tracking-tight uppercase">System Core Updates</h4>
                    <p className="text-zinc-500 text-xs md:text-sm font-bold">Modify Identity Tokens and Neural Uplink configurations.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4">
                      <div className="bg-white/2 rounded-[1.5rem] md:rounded-2xl p-5 md:p-6 border border-white/5">
                        <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Operator Alias</p>
                        <p className="text-base md:text-lg font-bold text-white tracking-tight">{user?.name}</p>
                      </div>
                      <div className="bg-white/2 rounded-[1.5rem] md:rounded-2xl p-5 md:p-6 border border-white/5">
                        <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Access Protocol</p>
                        <p className="text-base md:text-lg font-bold text-white tracking-tight truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 md:gap-4">
                      <button
                        onClick={() => setEditMode(true)}
                        className="premium-button py-4 md:py-5 text-[10px] md:text-sm flex items-center justify-center gap-3 font-black uppercase tracking-widest"
                      >
                        <Settings size={18} /> Edit Profile
                      </button>
                      <button onClick={logout}
                        className="py-4 md:py-5 bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] text-zinc-500 font-black text-[10px] md:text-sm uppercase tracking-widest hover:text-white transition-all active:scale-95"
                      >
                         Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS SECTION */}

      {/* ✅ DELETE CONFIRM MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-6 animate-in fade-in duration-300">
          <div className="glass-card border-white/10 p-8 md:p-10 w-full max-w-sm text-center shadow-[0_0_100px_rgba(34,197,94,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/30" />
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-6 md:mb-8 animate-pulse">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-2 uppercase tracking-tight">Resolve Protocol?</h3>
            <p className="text-zinc-500 text-xs md:text-sm mb-8 md:mb-10 leading-relaxed font-bold">
              Archiving this node vector from established civic grids. Proceed?
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="py-4 rounded-2xl glass font-black uppercase tracking-widest text-[10px] md:text-xs text-zinc-500 hover:text-white transition-all active:scale-95"
              >
                Abort
              </button>
              <button
                onClick={confirmDelete}
                className="py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-emerald-400 shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all active:scale-95"
              >
                Finalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-6 animate-in fade-in duration-500">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 md:top-10 md:right-10 bg-black/60 p-3 md:p-4 rounded-2xl hover:bg-white/10 hover:rotate-90 transition-all duration-300 border border-white/10 z-[120]"
          >
            <X size={24} />
          </button>
          <img
            src={previewImage}
            className="max-w-full max-h-full rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] p-1 bg-white/[0.02] object-contain"
          />
        </div>
      )}

      {/* ✅ EDIT PROFILE MODAL */}
      {editMode && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-6 animate-in fade-in duration-300">
          <div className="glass-card border-white/10 p-8 md:p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-secondary" />
            <button onClick={() => setEditMode(false)} className="absolute top-6 right-6 md:top-8 md:right-8 text-zinc-500 hover:text-white transition-all scale-110 active:scale-90">
              <X size={24} />
            </button>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 md:mb-8">
              <User size={32} />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight uppercase">Identity Overhaul</h2>
            <p className="text-zinc-500 text-xs md:text-sm mb-8 md:mb-10 leading-relaxed font-bold">Re-authenticating identifiers with encrypted uplink.</p>

            <div className="space-y-4 md:space-y-6">
              <div className="relative group">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Operative Name"
                  className="w-full pl-6 pr-6 py-4 rounded-2xl glass border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all outline-none font-bold text-sm md:text-base"
                />
              </div>

              <div className="relative p-2 rounded-[1.5rem] md:rounded-[2rem] glass border-white/5">
                <label className="flex items-center gap-4 cursor-pointer p-3 md:p-4 rounded-[1.25rem] md:rounded-[1.5rem] hover:bg-white/[0.02] transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Camera className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-[10px] uppercase tracking-widest">Update Imagery</p>
                    <p className="text-zinc-600 font-bold text-[9px]">JPEG, PNG (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {file && <div className="p-2 text-center text-[8px] font-black text-emerald-400 uppercase tracking-widest">{file.name} ready for uplink</div>}
              </div>

              <div className="flex gap-4 pt-4 md:pt-6">
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-4 md:py-5 rounded-2xl glass font-black uppercase tracking-widest text-[10px] md:text-xs text-zinc-500 hover:text-white transition-all active:scale-95"
                >
                  Discard
                </button>
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="flex-1 py-4 md:py-5 rounded-2xl premium-button font-black uppercase tracking-widest text-[10px] md:text-xs text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Sync Core"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
