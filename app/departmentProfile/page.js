"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
    MapPin,
    Mail,
    X,
    Building2,
    Globe,
    ShieldCheck,
    Camera,
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
      console.log("✅ Image updated in form:", updated.image);
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

    return (
        <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
            <DepartmentNavbar />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#10b98122,transparent_60%)]"></div>

            <div className="relative max-w-5xl mx-auto px-4 py-10">

                {/* ================= PROFILE CARD ================= */}
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.7)]">

                    {/* Glow Border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent blur-2xl"></div>

                    <div className="relative flex flex-col items-center">

                        {/* Avatar */}
                        <div className="relative group">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 group-hover:opacity-100 transition"></div>
                            <img
                                src={user?.image || "/default-avatar.png"}
                                className="relative w-36 h-36 rounded-full object-cover border-4 border-emerald-400 shadow-xl"
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-bold tracking-wide">
                            {user?.name}
                        </h2>

                        <p className="mt-2 text-gray-400 flex items-center gap-2 text-sm">
                            <Mail size={14} />
                            {user?.email}
                        </p>

                        <span className="mt-4 px-5 py-1.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 flex items-center gap-1">
                            <ShieldCheck size={14} /> Verified Department
                        </span>

                        <button
                            onClick={() => setOpenEdit(true)}
                            className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold hover:scale-105 transition shadow-lg"
                        >
                            Edit Profile
                        </button>

                        {/* Info Cards */}
                        <div className="grid  md:grid-cols-2 gap-6 w-full mt-10">
                            
            
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-emerald-400/40 transition">
                                <p className="text-gray-400 text-sm flex items-center gap-2">
                                    <Building2 size={16} /> Department
                                </p>
                                <p className="mt-2 text-emerald-400 font-semibold text-lg">
                                    {user?.name}
                                </p>
                            </div>

                            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/40 transition">
                                <p className="text-gray-400 text-sm flex items-center gap-2">
                                    <Globe size={16} /> Coordinates
                                </p>
                                <p className="mt-2 text-cyan-300 text-sm">
                                    {user?.location?.lat}, {user?.location?.lng}
                                </p>
                            </div>

                            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-emerald-400/40 transition md:col-span-3">
                                <p className="text-gray-400 text-sm flex items-center gap-2">
                                    <MapPin size={16} /> Address
                                </p>
                                <p className="mt-2 text-gray-200">
                                    {user?.address}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ================= EDIT MODAL ================= */}
            {openEdit && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">

                    <div className="relative bg-[#020617] border border-white/10 rounded-2xl p-8 w-full max-w-xl shadow-[0_50px_150px_rgba(0,0,0,0.9)]">

                        {/* Header */}
                        <div className="flex justify-end items-center mb-6">
                            {/* <h2 className="text-xl text-center font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Update Department Profile
              </h2> */}
                            <button onClick={() => setOpenEdit(false)}>
                                <X className="text-gray-400 hover:text-white transition" />
                            </button>
                        </div>

                        {/* ================= IMAGE CENTERED ================= */}
                        <div className="flex flex-col items-center mb-6">

                            <div className="relative group">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 blur-lg opacity-50 group-hover:opacity-100 transition"></div>

                                <img
                                    src={preview || "/default-avatar.png"}
                                    className="relative w-24 h-24 rounded-full object-cover border-4 border-emerald-400 shadow-lg"
                                />
                            </div>

                            <label className="mt-4 px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-400/40 transition cursor-pointer flex items-center gap-2 text-sm">
                                <Camera size={16} />
                                Change Image
                                <input type="file" hidden onChange={handleImageChange} />
                            </label>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-4">

                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Department Name"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 outline-none transition"
                            />

                            <input
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                placeholder="Address"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 outline-none transition"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    value={form.lat}
                                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                                    placeholder="Latitude"
                                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none transition"
                                />
                                <input
                                    value={form.lng}
                                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                                    placeholder="Longitude"
                                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none transition"
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold hover:scale-[1.03] transition disabled:opacity-50"
                            >
                                {loading ? "Updating..." : "Save Changes"}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
