"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden py-12 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-xl bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-8 lg:p-12 animate-in fade-in zoom-in duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-zinc-400 font-medium">
            Join the Smart Civic ecosystem today.
          </p>
        </div>

        {/* Modern Segmented Toggle */}
        <div className="flex bg-zinc-800/50 border border-white/5 rounded-2xl p-1.5 mb-8">
          <button
            onClick={() => setType("user")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              type === "user"
                ? "bg-green-500 text-black shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            👤 User
          </button>
          <button
            onClick={() => setType("department")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              type === "department"
                ? "bg-green-500 text-black shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🏢 Department
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* USER FIELDS */}
          {type === "user" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="John Doe"
                  className="pro-input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="name@example.com"
                  className="pro-input"
                  required
                />
              </div>
            </div>
          )}

          {/* DEPARTMENT FIELDS */}
          {type === "department" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Department Name</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  placeholder="Sanitation Dept."
                  className="pro-input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Official Email</label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="dept@city.gov"
                  className="pro-input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Office Address</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="address"
                  value={formData.address}
                  placeholder="123 Civic Plaza"
                  className="pro-input"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Latitude</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="lat"
                    value={formData.lat}
                    placeholder="0.0000"
                    className="pro-input"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Longitude</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="lng"
                    value={formData.lng}
                    placeholder="0.0000"
                    className="pro-input"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* SHARED FIELDS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Security Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={formData.password}
              placeholder="••••••••"
              className="pro-input"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Profile / Logo Image</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="pro-input file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-green-500 file:text-black hover:file:bg-green-400 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-4 mt-4 rounded-2xl font-black uppercase tracking-wider transition-all duration-300 transform active:scale-95 shadow-[0_10px_20px_rgba(34,197,94,0.2)] ${
              uploading 
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" 
                : "bg-green-500 hover:bg-green-400 text-black hover:translate-y-[-2px]"
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : (
              "🚀 Sign Up Now"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Already a member?{" "}
          <Link href="/login" className="text-green-400 font-bold hover:text-green-300 transition-colors underline-offset-4 hover:underline">
            Login here
          </Link>
        </p>
      </div>

      <style jsx>{`
        .pro-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          font-size: 15px;
          transition: all 0.3s ease;
        }
        .pro-input:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .pro-input:focus {
          background: rgba(255, 255, 255, 0.07);
          border-color: #22c55e;
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
          outline: none;
        }
        .pro-input::placeholder {
          color: #52525b;
        }
      `}</style>
    </div>
  );
};

export default Page;