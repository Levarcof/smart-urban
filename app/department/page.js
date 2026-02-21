"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    Search, MapPin, CheckCircle,
    Clock, Filter, ImageIcon,
    AlertTriangle, Activity,
    Layers, BarChart3, RefreshCcw
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

    // ✅ FIXED STATES
    const [cleanImage, setCleanImage] = useState(null); // now File object
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
            alert("Please upload cleaned image first");
            return;
        }

        try {
            setSending(true);

            // -------------------------------
            // 1️⃣ Upload to Cloudinary
            // -------------------------------
            const cloudForm = new FormData();
            cloudForm.append("file", cleanImage); // File object
            cloudForm.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

            const cloudRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
                { method: "POST", body: cloudForm }
            );

            const cloudData = await cloudRes.json();

            if (!cloudData.secure_url) {
                alert("Cloudinary upload failed");
                return;
            }

            const cleanImageUrl = cloudData.secure_url;

            // -------------------------------
            // 2️⃣ Call /api/cleanImage
            // -------------------------------
            const cleanRes = await fetch("/api/cleanImage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: cleanImageUrl }),
            });

            const cleanData = await cleanRes.json();

            if (!cleanData.success) {
                alert("AI Validation Failed");
                return;
            }

            // -------------------------------
            // 3️⃣ Create Merged Image (Side by Side)
            // -------------------------------
            const report = reports.find(r => r._id === selectedId);
            if (!report) return;

            const originalUrl = report.images?.[0];

            const mergedImageUrl =
                `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/` +
                `w_600,h_600,c_fill/${originalUrl.split("/upload/")[1]}` +
                `/fl_layer_apply,x_600/` +
                `${cleanImageUrl.split("/upload/")[1]}`;

            // -------------------------------
            // 4️⃣ Call /api/addNotification
            // -------------------------------
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
                alert("Notification Sent Successfully");
            }

        } catch (err) {
            console.error("Resolve Error:", err);
            alert("Something went wrong");
        } finally {
            setSending(false);
            setConfirmBox(false);
            setSelectedId(null);
            setCleanImage(null);
        }
    };

    const stats = useMemo(() => ([
        { label: "Active Reports", value: reports.length, icon: AlertTriangle, trend: "Stable", color: "text-red-400" },
        { label: "Network Health", value: "98.4%", icon: Activity, trend: "Nominal", color: "text-blue-400" }
    ]), [reports.length]);

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-emerald-500/20 antialiased">
            <DepartmentNavbar />

            {/* --- DASHBOARD BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-8 md:pt-28 md:pb-12 lg:py-12 lg:pt-32">

                {/* --- DASHBOARD HEADER --- */}
                <header className="mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 px-0.5">
                        <Layers size={12} className="text-emerald-500/80" />
                        Admin Console / Maintenance
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">
                            Reporting Dashboard
                        </h1>
                        <button
                            onClick={fetchReports}
                            className="p-2 md:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-all text-zinc-400 hover:text-white shrink-0"
                            title="Refresh Data"
                        >
                            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                    <p className="text-zinc-500 text-[10px] md:text-sm font-medium mt-1.5 line-clamp-1 md:line-clamp-none">
                        Systemized view of municipal alerts and incident resolution queue.
                    </p>
                </header>

                {/* --- ANALYTICS BAR --- */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-panel p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <stat.icon size={12} className={stat.color} />
                                    {stat.label}
                                </span>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded bg-white/[0.04] ${stat.color} border border-white/[0.05]`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-white tracking-tight">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- SEARCH & ACTIONS --- */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-10 bg-white/[0.015] p-3 rounded-2xl border border-white/[0.06] backdrop-blur-md">
                    <div className="relative flex-1 group w-full">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search records by sector or detail..."
                            className="w-full bg-transparent border-none pl-11 pr-4 py-2 text-sm text-white placeholder-zinc-700 outline-none transition-all"
                        />
                    </div>

                    <div className="h-6 w-[1px] bg-white/[0.08] hidden md:block"></div>

                    <div className="flex items-center gap-2 p-1 bg-black/20 rounded-xl border border-white/[0.05] w-full md:w-auto">
                        <div className="flex items-center gap-2 px-3 text-zinc-600">
                            <Filter size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Filter</span>
                        </div>
                        {["all", "today", "month"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                                    : "text-zinc-500 hover:text-white"}`}
                            >
                                {f === "all" ? "All" : f === "today" ? "24h" : "30d"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- DATA VIEW --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-48 bg-white/[0.02] rounded-2xl border border-white/[0.05] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                        {filteredReports.map((rep, i) => (
                            <div
                                key={rep._id}
                                className="group relative flex flex-col bg-white/[0.015] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.03] hover:border-white/[0.12] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                {/* Media Strip */}
                                <div
                                    className="relative h-32 w-full overflow-hidden bg-[#0a0a0a] cursor-pointer"
                                    onClick={() => rep.images?.[0] && setPreviewImage(rep.images[0])}
                                >
                                    {rep.images?.[0] ? (
                                        <img
                                            src={rep.images[0]}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                                            alt="Anomaly Incident"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.01]">
                                            <ImageIcon size={20} className="text-zinc-800 mb-1" />
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-800">No Image</span>
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/[0.05] shadow-lg">
                                        <Clock size={10} className="text-emerald-500/80" />
                                        <span className="text-[9px] font-bold text-gray-300">
                                            {new Date(rep.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050505] to-transparent"></div>
                                </div>

                                {/* Content Details */}
                                <div className="p-4 flex flex-col flex-1 relative mt-[-10px] z-10 px-5">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/80"></div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Incident Rec-#{rep._id.slice(-4)}</span>
                                    </div>

                                    <h3 className="text-sm font-bold text-white mb-1 tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-1">
                                        {rep.name || "External Link"}
                                    </h3>

                                    <div className="flex items-start gap-1.5 text-[10px] text-zinc-500 mb-4 leading-normal">
                                        <MapPin size={10} className="shrink-0 text-emerald-500/40 mt-0.5" />
                                        <span className="line-clamp-1">{rep.address || "Unassigned Sector"}</span>
                                    </div>

                                    <div className="relative mb-5 pt-3 border-t border-white/[0.04]">
                                        <p className="text-zinc-400 text-[11px] italic font-medium leading-[1.6] line-clamp-2">
                                            "{rep.message || "Manual log entry missing."}"
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { setSelectedId(rep._id); setConfirmBox(true); }}
                                        className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-[0.98]"
                                    >
                                        <CheckCircle size={12} /> Resolve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State Dash */}
                {!loading && filteredReports.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/[0.01] rounded-[2rem] border border-dashed border-white/[0.08]">
                        <div className="w-12 h-12 rounded-full border border-white/[0.05] flex items-center justify-center mb-4 text-zinc-800">
                            <BarChart3 size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">Queue Empty</h4>
                        <p className="text-zinc-600 text-[11px] font-medium uppercase tracking-widest">
                            All anomalies rectified for this filter
                        </p>
                    </div>
                )}
            </main>

            {/* --- DASHBOARD MODALS --- */}
            {/* Confirm Resolver */}
            {confirmBox && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
                    <div className="bg-[#0a0a0a] w-full max-w-4xl rounded-3xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold mb-6">Verify Cleaning Evidence</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* LEFT - ORIGINAL IMAGE */}
                            <div>
                                <p className="text-xs text-zinc-400 mb-2">Original Image</p>
                                <img
                                    src={reports.find(r => r._id === selectedId)?.images?.[0]}
                                    className="h-64 w-full object-cover rounded-xl"
                                />
                            </div>

                            {/* RIGHT - UPLOAD CLEAN IMAGE */}
                            <div>
                                <p className="text-xs text-zinc-400 mb-2">Upload Clean Image</p>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setCleanImage(file); // File object now
                                    }}
                                    className="mb-4"
                                />

                                {cleanImage && (
                                    <img
                                        src={URL.createObjectURL(cleanImage)}
                                        className="h-40 w-full object-cover rounded-xl"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setConfirmBox(false)}
                                className="px-6 py-2 bg-white/10 rounded-xl">
                                Cancel
                            </button>

                            <button
                                onClick={resolveIssue}
                                disabled={sending}
                                className="px-6 py-2 bg-emerald-500 rounded-xl text-black font-bold">
                                {sending ? "Sending..." : "Send Notification"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Preview */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-in zoom-in duration-300 cursor-zoom-out p-6"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-5xl w-full flex justify-center">
                        <img
                            src={previewImage}
                            className="max-h-[80vh] rounded-3xl border border-white/[0.1] shadow-[0_0_80px_rgba(0,0,0,0.5)] object-contain"
                            alt="Visual Detail"
                        />
                        <button className="absolute -top-12 right-0 text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px] hover:text-white transition-colors">
                            Close Preview
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}