"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Sparkles, Mail, Lock, User as UserIcon, Building, MapPin, Globe, Upload, ArrowRight, ShieldCheck } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [type, setType] = useState("user"); // user | department
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    departmentName: "",
    address: "",
    lat: "",
    lng: "",
  });
  const [file, setFile] = useState(null); // File selected
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToCloudinary = async () => {
    if (!file) return formData.image;
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
      alert("❌ Image upload failed");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadToCloudinary();
    const apiUrl = type === "user" ? "/api/auth/signup" : "/api/auth/garbage";

    const payload =
      type === "user"
        ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          image: imageUrl,
        }
        : {
          departmentName: formData.departmentName,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          location: {
            lat: Number(formData.lat),
            lng: Number(formData.lng),
          },
          image: imageUrl,
        };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Account created successfully!");
        router.push("/login");
      } else {
        alert(data.message || "❌ Something went wrong");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-8 md:py-12 px-0 md:px-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[50%] h-[50%] bg-accent/10 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[120px]" />

      <div className="relative w-full max-w-2xl glass-card p-6 md:p-10 lg:p-14 animate-in fade-in zoom-in duration-700 rounded-none md:rounded-[2.5rem] border-none md:border border-white/5">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-accent-secondary" />

        {/* Header Section */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent/10 text-accent mb-4 md:mb-6 shadow-xl">
            <Sparkles size={28} className="md:w-8 md:h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 tracking-tight">
            Create Account
          </h1>
          <p className="text-zinc-500 font-medium text-base md:text-lg">
            Join the SmartCivic ecosystem today.
          </p>
        </div>

        {/* SWITCHER */}
        <div className="flex glass p-1 rounded-2xl mb-8 md:mb-10 shadow-inner">
          <button
            onClick={() => setType("user")}
            className={`flex-1 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2 ${type === "user"
              ? "bg-accent text-white shadow-lg shadow-accent/20"
              : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <UserIcon size={16} className="md:w-[18px]" /> Citizen
          </button>
          <button
            onClick={() => setType("department")}
            className={`flex-1 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2 ${type === "department"
              ? "bg-accent text-white shadow-lg shadow-accent/20"
              : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <Building size={16} className="md:w-[18px]" /> Dept
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* USER FIELDS */}
          {type === "user" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                    <UserIcon size={18} />
                  </div>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="John Doe"
                    className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                    <Mail size={18} />
                  </div>
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="name@nexus.com"
                    className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEPARTMENT FIELDS */}
          {type === "department" && (
            <div className="space-y-5 md:space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Entity Designation</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                      <Building size={18} />
                    </div>
                    <input
                      onChange={handleChange}
                      type="text"
                      name="departmentName"
                      value={formData.departmentName}
                      placeholder="Sanitation Dept."
                      className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Official Uplink</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                      <Mail size={18} />
                    </div>
                    <input
                      onChange={handleChange}
                      type="email"
                      name="email"
                      value={formData.email}
                      placeholder="dept@city.gov"
                      className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Physical Coordinates</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                    <MapPin size={18} />
                  </div>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="address"
                    value={formData.address}
                    placeholder="123 Civic Plaza"
                    className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Latitude</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                      <Globe size={18} />
                    </div>
                    <input
                      onChange={handleChange}
                      type="text"
                      name="lat"
                      value={formData.lat}
                      placeholder="0.0000"
                      className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Longitude</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                      <Globe size={18} />
                    </div>
                    <input
                      onChange={handleChange}
                      type="text"
                      name="lng"
                      value={formData.lng}
                      placeholder="0.0000"
                      className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SHARED FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Access Protocol</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                  <Lock size={18} />
                </div>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Avatar Uplink</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-accent">
                  <Upload size={18} />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white file:hidden cursor-pointer focus:outline-none focus:border-accent/40 transition-all duration-300 text-sm md:text-base"
                />
                {!file && <span className="absolute left-14 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none text-sm font-medium">Capture or Load...</span>}
                {file && <span className="absolute left-14 top-1/2 -translate-y-1/2 text-white truncate max-w-[120px] md:max-w-[150px] font-bold text-sm">{file.name}</span>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-5 rounded-2xl font-black tracking-[0.1em] uppercase flex items-center justify-center gap-3 mt-4 active:scale-95 transition-all shadow-xl ${uploading
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
              : "premium-button"
              }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Syncing Identity...
              </span>
            ) : (
              <>Initiate Registration <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 mt-8 md:mt-10 font-medium">
          Already a regional member?{" "}
          <Link href="/login" className="text-white font-black hover:text-accent transition-colors underline md:no-underline">
            Authorize Proxy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
