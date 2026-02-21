"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

const Page = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const [type, setType] = useState("user"); // user | department

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl =
      type === "user" ? "/api/auth/login" : "/api/auth/login/garbage";

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Login successful!");
      setUser(data.user);
      if (type == "user") {
        router.push("/");
      } else {
        router.push("/department");
      }
    } else {
      alert(data.message || "❌ Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
      {/* Dynamic Background Blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-5xl bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
        
        {/* LEFT SECTION - Brand Identity */}
        <div className="md:w-5/12 bg-gradient-to-br from-green-500 to-green-700 text-white flex flex-col items-center justify-center p-12 relative">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
          />
          
          <div className="w-28 h-28 relative mb-8 drop-shadow-2xl">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-center">
            Smart Civic
          </h1>
          <div className="h-1 w-12 bg-white/40 rounded-full mb-6" />
          <p className="text-center text-green-50 font-medium leading-relaxed opacity-90">
            Next-gen traffic and waste management for modern urban ecosystems.
          </p>
        </div>

        {/* RIGHT SECTION - Form Controls */}
        <div className="md:w-7/12 p-10 lg:p-16 flex flex-col justify-center bg-zinc-900/30">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-zinc-400 font-medium">Please enter your details to sign in.</p>
          </div>

          {/* TOGGLE BUTTONS - Modern Pill Style */}
          <div className="flex bg-zinc-800/50 border border-white/5 rounded-2xl p-1.5 mb-8">
            <button
              onClick={() => setType("user")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                type === "user"
                  ? "bg-green-500 text-black shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-lg">👤</span> User
            </button>
            <button
              onClick={() => setType("department")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                type === "department"
                  ? "bg-green-500 text-black shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-lg">🏢</span> Department
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="pro-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="pro-input"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-4 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider transition-all duration-300 transform hover:translate-y-[-2px] active:scale-95 shadow-[0_10px_20px_rgba(34,197,94,0.2)]"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-green-400 font-bold hover:text-green-300 transition-colors underline-offset-4 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
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