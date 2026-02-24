"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    Search, MapPin, CheckCircle,
    Clock, Filter, ImageIcon,
    AlertTriangle, Activity,
    Layers, BarChart3, RefreshCcw,
    Shield, Sparkles, Zap,
    ArrowRight, Info, ShieldCheck,
    X, Camera, Globe, Loader2
} from "lucide-react";
import { useUser } from "../context/UserContext";
import DepartmentNavbar from "../components/DepartmentNavbar";

export default function DepartmentReportsPage() {

    const { user } = useUser();

    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [confirmBox, setConfirmBox] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [cleanImage, setCleanImage] = useState(null);
    const [sending, setSending] = useState(false);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/myReport/garbage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user?.email }),
            });
            const data = await res.json();
            if (data.success) {
                setReports(data.reports);
                setFilteredReports(data.reports);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) fetchReports();
    }, [user]);

    useEffect(() => {
        let temp = [...reports];
        if (search) {
            const q = search.toLowerCase();
            temp = temp.filter((r) =>
                r.address?.toLowerCase().includes(q) ||
                r.message?.toLowerCase().includes(q) ||
                r.name?.toLowerCase().includes(q)
            );
        }
        if (filter !== "all") {
            const now = new Date();
            temp = temp.filter((r) => {
                const created = new Date(r.createdAt);
                if (filter === "today") return created.toDateString() === now.toDateString();
                if (filter === "month") return (now - created) / (1000 * 60 * 60 * 24) <= 30;
                return true;
            });
        }
        setFilteredReports(temp);
    }, [search, filter, reports]);

    const resolveIssue = async () => {

        if (!cleanImage) {
            alert("⚠️ Protocol Violation: Photographic evidence of rectification required.");
            return;
        }

        try {
            setSending(true);

            const cloudForm = new FormData();
            cloudForm.append("file", cleanImage);
            cloudForm.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

            const cloudRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
                { method: "POST", body: cloudForm }
            );

            const cloudData = await cloudRes.json();

            if (!cloudData.secure_url) {
                alert("❌ Encryption Failure: Cloud uplink failed.");
                return;
            }

            const cleanImageUrl = cloudData.secure_url;

            const cleanRes = await fetch("/api/cleanImage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: cleanImageUrl }),
            });

            const cleanData = await cleanRes.json();

            if (!cleanData.success) {
                alert("⚠️ Neural Validation Error: Scene resolution mismatch. Verify clean status.");
                return;
            }

            const report = reports.find(r => r._id === selectedId);
            if (!report) return;

            const originalUrl = report.images?.[0];

            const notifyRes = await fetch("/api/addNotification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: report.email,
                    image: originalUrl,
                    departmentName: user?.name
                }),
            });

            const notifyData = await notifyRes.json();

            if (notifyData.success) {
                setReports(prev => prev.filter(r => r._id !== selectedId));
                alert("✅ Sector Restored: Protocol finalized and user notified.");
            }

        } catch (err) {
            console.error("Resolve Error:", err);
            alert("❌ Critical Error: Resolution uplink severed.");
        } finally {
            setSending(false);
            setConfirmBox(false);
            setSelectedId(null);
            setCleanImage(null);
        }
    };

    const stats = useMemo(() => ([
        { label: "Pending", value: reports.length, icon: AlertTriangle, trend: "+2.4%", color: "text-red-500", bg: "bg-red-500/10" },
        { label: "Integrity", value: "99.2%", icon: Activity, trend: "Nominal", color: "text-accent", bg: "bg-accent/10" },
        { label: "Load", value: "Low", icon: Zap, trend: "Optimized", color: "text-accent-secondary", bg: "bg-accent-secondary/10" },
        { label: "Uptime", value: "128d", icon: Globe, trend: "Stable", color: "text-emerald-500", bg: "bg-emerald-500/10" }
    ]), [reports.length]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
            <DepartmentNavbar />

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[100%] md:w-[60%] h-[60%] bg-accent/5 rounded-full blur-[80px] md:blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[100%] md:w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-5 md:pt-32 pb-24">

                {/* --- DASHBOARD HEADER --- */}
                <header className="flex  md:items-end justify-between item-center gap-6 md:gap-8 mb-6 md:mb-10 animate-in fade-in slide-in-from-top-8 duration-1000">
                    <div className="text-center md:text-left">
                        {/* <div className="inline-flex items-center gap-2 text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
                            <Layers size={14} className="text-accent-secondary" />
                            Nexus Command Terminal / Admin Layer
                        </div> */}
                        <h1 className="text-xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase italic">
                            Operational <span className="text-gradient">Intelligence</span>
                        </h1>
                        {/* <p className="text-zinc-500 text-sm md:text-lg font-medium mt-4 max-w-2xl mx-auto md:mx-0">
                            Strategic oversight and resolution interface for municipal anomalies and structural protocols.
                        </p> */}
                    </div>
                    <button
                        onClick={fetchReports}
                        className="w-10 h-6 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl glass border-white/10 hover:border-accent/40 bg-white/[0.05] transition-all group shrink-0 mx-auto md:mx-0 active:scale-90"
                        title="Resync Data"
                    >
                        <RefreshCcw size={20} className={`text-zinc-500 group-hover:text-white transition-colors ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} />
                    </button>
                </header>

                {/* --- ANALYTICS READOUT --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card p-4 md:p-6 border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-500 active:scale-[0.98]">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[40px] opacity-20 -z-10`} />
                            <div className="flex items-center justify-between mb-2 md:mb-4">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-inner`}>
                                    <stat.icon className="w-4 h-4 md:w-5 md:h-5"  />
                                </div>
                                <span className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.trend}</span>
                            </div>
                            <p className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 font-mono">{stat.label}</p>
                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight italic">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* --- SEARCH & PROTOCOLS --- */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 md:gap-6 mb-12 animate-in fade-in duration-1000 delay-200">
                    <div className="relative flex-1 group min-h-[56px] md:min-h-[64px]">
                        <Search size={16} className="absolute left-6 top-1/3 md:top-1/2  -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors pointer-events-none" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Identify anomaly..."
                            className="w-full h-full bg-white/[0.03] border border-white/5 rounded-2xl md:py-5 py-2 pl-16 pr-6 text-sm text-white placeholder-zinc-700 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold"
                        />
                    </div>

                    <div className="flex items-center p-1.5 md:p-2 glass border-white/10 rounded-2xl min-h-[56px] md:min-h-[64px] overflow-x-auto no-scrollbar">
                        <div className="px-4 text-zinc-600 flex items-center gap-3 shrink-0">
                            <Filter size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden xl:inline font-mono">Filter</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {["all", "today", "month"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${filter === f
                                        ? "bg-accent text-white shadow-[0_10px_20px_rgba(99,102,241,0.3)]"
                                        : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"}`}
                                >
                                    {f === "all" ? "Neural" : f === "today" ? "Shift-24" : "Cycle-30"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- INTELLIGENCE GRID --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-96 glass-card border-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-32">
                        {filteredReports.map((rep, i) => (
                            <div
                                key={rep._id}
                                className="glass-card border-white/5 overflow-hidden group hover:border-accent/40 transition-all duration-700 flex flex-col animate-in fade-in slide-in-from-bottom-8 active:scale-[0.98]"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {/* Media Feed */}
                                <div
                                    className="relative aspect-video w-full overflow-hidden bg-black/40 cursor-zoom-in group/media"
                                    onClick={() => rep.images?.[0] && setPreviewImage(rep.images[0])}
                                >
                                    {rep.images?.[0] ? (
                                        <img
                                            src={rep.images[0]}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
                                            alt="Anomaly Incident"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                                            <ImageIcon size={32} className="text-zinc-500 mb-2" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] font-mono">No Imagery</span>
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 flex items-center gap-2 glass-card bg-black/60 px-3 py-1.5 border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-105">
                                        <Clock size={12} className="text-accent" />
                                        <span className="text-[9px] font-black text-white tracking-widest font-mono">
                                            {new Date(rep.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                                </div>

                                {/* Detailed Telemetry */}
                                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 font-mono">Protocol #{rep._id.slice(-6)}</span>
                                    </div>

                                    <h3 className="text-lg md:text-xl font-black text-white mb-2 tracking-tight group-hover:text-accent transition-colors line-clamp-1 italic uppercase">
                                        {rep.name || "External Link Entry"}
                                    </h3>

                                    <div className="flex items-start gap-2 text-[10px] md:text-[11px] text-zinc-500 mb-6 font-bold leading-relaxed uppercase tracking-tight">
                                        <MapPin size={14} className="shrink-0 text-accent/60 mt-0.5" />
                                        <span className="line-clamp-2">{rep.address || "Unassigned Sector Vector"}</span>
                                    </div>

                                    <div className="relative mb-8 pt-4 border-t border-white/5">
                                        <p className="text-zinc-400 text-xs italic font-medium leading-relaxed line-clamp-3">
                                            "{rep.message || "No descriptive log analytical data available."}"
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { setSelectedId(rep._id); setConfirmBox(true); }}
                                        className="mt-auto premium-button flex items-center justify-center gap-3 w-full py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-[0_15px_30px_rgba(99,102,241,0.3)] transition-all group/btn"
                                    >
                                        <CheckCircle size={16} /> Resolve Issue <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- QUEUE DEPLETED --- */}
                {!loading && filteredReports.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 md:py-48 glass-card border-white/5 border-dashed active:scale-95 transition-all">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl glass border-white/5 flex items-center justify-center mb-6 md:mb-8 text-zinc-800 animate-pulse shadow-inner">
                            <ShieldCheck size={48} className="md:size-12" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-black text-white mb-2 uppercase italic">Systems Nominal</h4>
                        <p className="text-zinc-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-mono">
                            Resolution queue fully processed.
                        </p>
                    </div>
                )}
            </main>

            {/* --- ADMINISTRATIVE MODALS --- */}
            {confirmBox && (
                <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-2xl p-0 md:p-6 animate-in fade-in slide-in-from-bottom-10 md:slide-in-from-top-10 duration-500">
                    <div className="glass-card border-white/10 p-8 md:p-14 w-full h-[90vh] md:h-auto md:max-w-4xl relative overflow-hidden rounded-t-[2.5rem] md:rounded-[3rem]">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 md:hidden" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-secondary" />
                        <button onClick={() => setConfirmBox(false)} className="absolute top-8 md:top-10 right-8 md:right-10 text-zinc-500 hover:text-white transition-all scale-125 hover:rotate-90">
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                                <RefreshCcw size={32} className="md:size-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">Resolution Protocol</h2>
                                <p className="text-zinc-500 font-bold text-[10px] md:text-sm uppercase tracking-widest font-mono">Validate rectification Payload.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 overflow-y-auto max-h-[50vh] md:max-h-none no-scrollbar">
                            {/* Original Reference */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Initial Anomaly</p>
                                    <span className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded font-mono">Pre-Op</span>
                                </div>
                                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group">
                                    <img
                                        src={reports.find(r => r._id === selectedId)?.images?.[0]}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </div>

                            {/* Rectification Evidence */}
                            <div className="space-y-4">
                                <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Resolved Evidence</p>

                                <div className="relative group">
                                    {!cleanImage ? (
                                        <label className="flex flex-col items-center justify-center aspect-video w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/40 transition-all cursor-pointer group/upload active:scale-95">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full glass border-white/10 flex items-center justify-center text-zinc-600 group-hover/upload:text-accent mb-4 transition-colors">
                                               <Camera className="w-7 h-7 md:w-8 md:h-8" />
                                            </div>
                                            <p className="text-[10px] md:text-sm font-black text-zinc-500 group-hover/upload:text-white transition-colors uppercase tracking-widest">Upload Intel</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setCleanImage(e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                            <img
                                                src={URL.createObjectURL(cleanImage)}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => setCleanImage(null)}
                                                className="absolute top-4 right-4 p-2 bg-black/60 rounded-lg text-white hover:bg-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 md:gap-6 mt-8 md:mt-12 pt-8 md:pt-10 border-t border-white/5">
                            <button
                                onClick={() => setConfirmBox(false)}
                                className="w-full sm:w-auto px-10 py-4 glass border-white/10 rounded-2xl text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-all active:scale-95">
                                Abort
                            </button>

                            <button
                                onClick={resolveIssue}
                                disabled={sending}
                                className="w-full sm:w-auto premium-button px-12 py-4 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-40 font-black uppercase text-[10px] tracking-widest">
                                {sending ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Finalizing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} /> Finalize Resolution
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Visual Feed Preview */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-in zoom-in duration-500 cursor-zoom-out p-6"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-6xl w-full flex justify-center">
                        <div className="absolute -inset-4 bg-accent/20 blur-[100px] -z-10 animate-pulse" />
                        <img
                            src={previewImage}
                            className="max-h-[80vh] md:max-h-[85vh] rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] object-contain p-2 bg-white/[0.02]"
                            alt="Visual Intelligence"
                        />
                        <button className="absolute -top-12 md:-top-16 right-0 flex items-center gap-3 text-zinc-500 font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] hover:text-white transition-all group">
                            Close Feed <X size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}