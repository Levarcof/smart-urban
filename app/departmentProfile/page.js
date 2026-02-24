"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import {
    MapPin,
    Mail,
    X,
    Building2,
    Globe,
    ShieldCheck,
    Camera,
    Sparkles,
    Zap,
    Activity,
    Shield,
    ArrowRight,
    Loader2,
    LogOut
} from "lucide-react";
import DepartmentNavbar from "../components/DepartmentNavbar";

export default function DepartmentProfilePage() {
    const { user } = useUser();

    const [openEdit, setOpenEdit] = useState(false);
    const [form, setForm] = useState({
        name: "",
        address: "",
        lat: "",
        lng: "",
        image: "",
    });
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setForm({
                name: user?.name || "",
                address: user?.address || "",
                lat: user?.location?.lat || "",
                lng: user?.location?.lng || "",
                image: user?.image || "",
            });
            setPreview(user?.image || "");
        }
    }, [user]);

    const uploadImage = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
            { method: "POST", body: data }
        );

        const result = await res.json();
        return result.secure_url;
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        try {
            setPreview(URL.createObjectURL(file));

            const url = await uploadImage(file);

            setForm((prev) => {
                const updated = { ...prev, image: url };
                return updated;
            });

        } catch (err) {
            console.log("❌ Image upload failed:", err);
            alert("Image upload failed!");
        } finally {
            setLoading(false);
        }
    };


    const handleUpdate = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    address: form.address,
                    image: form.image,
                    location: {
                        lat: Number(form.lat),
                        lng: Number(form.lng),
                    },
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("✅ Profile updated successfully!");
                window.location.reload();
            } else {
                alert("❌ " + data.message);
            }
        } catch (err) {
            console.log(err);
            alert("❌ Update failed!");
        } finally {
            setLoading(false);
            setOpenEdit(false);
        }
    };
    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                router.replace("/login");
            }
        } catch (err) {
            console.log("Logout error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
            <DepartmentNavbar />

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[100%] md:w-[50%] h-[50%] bg-accent/5 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[100%] md:w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-5 md:pt-32 pb-24">

                {/* --- PROFILE HEADER --- */}
                <div className="mb-4 md:mb-6 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
                    {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent-secondary mb-4 md:mb-6">
                        <Sparkles size={14} /> Nexus Identity Terminal
                    </div> */}
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight uppercase italic">
                        Department <span className="text-gradient">Profile</span>
                    </h1>
                </div>

                {/* ================= PROFILE CARD ================= */}
                <div className="glass-card border-white/5 p-8 md:p-12 lg:p-16 relative overflow-hidden animate-in fade-in zoom-in duration-700">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-secondary" />

                    <div className="relative flex flex-col items-center">
                        {/* Avatar */}
                        <div className="relative group mb-6 md:mb-8">
                            <div className="absolute -inset-4 bg-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 md:p-2 glass border-white/10 group-hover:border-accent/40 transition-colors">
                                <img
                                    src={user?.image || "https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&size=200"}
                                    className="w-full h-full rounded-full object-cover shadow-2xl transition-transform duration-700 group-hover:scale-105"
                                    alt="Department Avatar"
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent flex items-center justify-center text-white border-2 md:border-4 border-background shadow-xl">
                                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight  italic text-center">
                            {user?.name}
                        </h2>

                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 mb-8 md:mb-10 text-center">
                            <div className="flex items-center gap-2 text-zinc-500 font-bold text-sm md:text-base">
                                <Mail size={16} className="text-accent" />
                                {user?.email}
                            </div>
                            <div className="hidden md:block w-1 h-1 rounded-full bg-zinc-800" />
                            <div className="text-accent-secondary font-black text-[9px] md:text-[10px] uppercase tracking-[.2em] flex items-center gap-2">
                                <Shield size={14} /> Verified Entity
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setOpenEdit(true)}
                                className="premium-button px-8 md:px-10 py-4 flex items-center gap-3 active:scale-95 text-[10px] uppercase tracking-widest font-black"
                            >
                                Edit Profile <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-red-500 border border-red-500 rounded-2xl px-6 md:px-10 py-2 flex items-center gap-3  active:scale-95 text-[10px] uppercase tracking-widest font-black"
                            >
                             <LogOut size={16}/>  LogOut 
                            </button>
                        </div>


                        {/* Info Readouts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full mt-12 md:mt-16 pt-12 md:pt-16 border-t border-white/5">

                            <div className="glass-card p-4 md:p-6 border-white/5 hover:border-accent/20 transition-all group active:scale-[0.98]">
                                <div className="flex items-center gap-4 mb-3 md:mb-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                                        <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Designation</p>
                                </div>
                                <p className="text-base md:text-lg font-black text-white tracking-tight italic ">
                                    {user?.name}
                                </p>
                            </div>

                            <div className="glass-card p-4 md:p-6 border-white/5 hover:border-accent-secondary/20 transition-all group active:scale-[0.98]">
                                <div className="flex items-center gap-4 mb-3 md:mb-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary group-hover:bg-accent-secondary group-hover:text-white transition-all shadow-inner">
                                        <Globe className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Geospatial Vector</p>
                                </div>
                                <p className="text-base md:text-lg font-black text-white tracking-tight font-mono">
                                    {user?.location?.lat?.toFixed(4)}, {user?.location?.lng?.toFixed(4)}
                                </p>
                            </div>

                            <div className="glass-card p-4 md:p-6 border-white/5 hover:border-emerald-500/20 transition-all group md:col-span-2 active:scale-[0.98]">
                                <div className="flex items-center gap-4 mb-3 md:mb-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                                        <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Sector HQ Address</p>
                                </div>
                                <p className="text-base md:text-lg font-black text-white tracking-tight leading-relaxed  italic">
                                    {user?.address || "Coordinate address not calibrated."}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* System Status Footer */}
                {/* <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 animate-in fade-in duration-1000 delay-1000">
                    <div className="flex items-center gap-2 text-zinc-600">
                        <Activity size={14} className="text-accent" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest font-mono">Uplink Nominal</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600">
                        <Zap size={14} className="text-accent-secondary" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest font-mono">Sync Active</span>
                    </div>
                </div> */}
            </div>

            {/* ================= EDIT MODAL ================= */}
            {openEdit && (
                <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in slide-in-from-bottom-10 md:slide-in-from-top-10 duration-500">

                    <div className="glass-card border-white/10 p-8 md:p-14 w-full h-[90vh] md:h-auto md:max-w-2xl relative overflow-hidden rounded-t-[2.5rem] md:rounded-[3rem]">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 md:hidden" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-secondary" />

                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">Configure Identity</h2>
                                <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest font-mono mt-1">Update operational metadata.</p>
                            </div>
                            <button onClick={() => setOpenEdit(false)} className="text-zinc-500 hover:text-white transition-all scale-125 hover:rotate-90">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[60vh] md:max-h-none no-scrollbar space-y-8">
                            {/* Avatar Configuration */}
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-accent/20 rounded-full blur-xl opacity-50" />
                                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-1.5 glass border-white/10 group-hover:border-accent/40 transition-colors">
                                        <img
                                            src={preview || "https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&size=200"}
                                            className="w-full h-full rounded-full object-cover shadow-2xl"
                                        />
                                        {loading && (
                                            <div className="absolute inset-0 bg-background/80 md:bg-black/60 rounded-full flex items-center justify-center">
                                                <Loader2 size={24} className="text-accent animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white text-black flex items-center justify-center cursor-pointer hover:bg-accent hover:text-white transition-all shadow-2xl active:scale-90">
                                        <Camera className="w-4 h-4 md:w-5 md:h-5" />
                                        <input type="file" hidden onChange={handleImageChange} />
                                    </label>
                                </div>
                                <p className="mt-4 text-[9px] font-black text-white/20 uppercase tracking-[.2em] font-mono">Neural Avatar Uplink</p>
                            </div>

                            {/* Form Inputs */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 font-mono">Entity Designation</p>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Department Name"
                                        className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 outline-none transition-all font-bold text-white text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 font-mono">Sector Address</p>
                                    <input
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        placeholder="Physical Coordinates"
                                        className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 outline-none transition-all font-bold text-white text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 font-mono">Latitude</p>
                                        <input
                                            value={form.lat}
                                            onChange={(e) => setForm({ ...form, lat: e.target.value })}
                                            placeholder="LAT"
                                            className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-accent-secondary/40 focus:ring-4 focus:ring-accent-secondary/5 outline-none transition-all font-bold text-white text-sm font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 font-mono">Longitude</p>
                                        <input
                                            value={form.lng}
                                            onChange={(e) => setForm({ ...form, lng: e.target.value })}
                                            placeholder="LNG"
                                            className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-accent-secondary/40 focus:ring-4 focus:ring-accent-secondary/5 outline-none transition-all font-bold text-white text-sm font-mono"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="premium-button w-full py-5 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-40 mt-4 md:mt-8 uppercase text-[10px] tracking-widest font-black"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> Calibrating...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={20} /> Save Changes
                                        </>
                                    )}
                                </button>

                            </div>
                        </div>
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
