"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Sparkles, Mail, Lock, User as UserIcon, Building, ArrowRight, ShieldCheck } from "lucide-react";

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

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        if (type == "user") {
          router.push("/");
        } else {
          router.push("/department");
        }
      } else {
        alert(data.message || "❌ Login failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-0 md:px-4">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] md:w-[60%] h-[60%] bg-accent/10 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[80%] md:w-[60%] h-[60%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[120px]" />

      <div className="w-full max-w-6xl flex flex-col lg:flex-row glass-card overflow-hidden animate-in fade-in zoom-in duration-700 rounded-none md:rounded-[2.5rem] min-h-screen md:min-h-0 border-none md:border border-white/5">

        {/* --- MOBILE LOGO (Hidden on Desktop) --- */}
        <div className="lg:hidden flex items-center justify-between p-6 pt-12 relative z-10 w-full">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">SmartCivic</span>
          </Link>
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
            <ShieldCheck size={20} />
          </div>
        </div>

        {/* SIDEBAR - Visual Brand (Desktop Only) */}
        <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-accent to-accent-secondary p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0L15 30M0 15L30 15' stroke='white' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")` }}
          />

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 mb-16 group">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                <Sparkles size={28} className="text-white" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">SmartCivic</span>
            </Link>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Empowering <br />
              <span className="text-white/70">Urban Living.</span>
            </h1>
            <p className="text-white/80 text-lg max-w-sm leading-relaxed">
              Experience the next generation of smart city management with our AI-driven ecosystem.
            </p>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-full bg-accent-secondary flex items-center justify-center text-white font-bold text-xl">
                2k
              </div>
              <p className="text-sm text-white/90 font-medium">
                Active citizens contributing to a smarter future today.
              </p>
            </div>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="w-full lg:w-[60%] p-6 md:p-12 lg:p-20 flex flex-col justify-center bg-zinc-900/20 relative z-10">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 md:mb-10 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 tracking-tight">Welcome Back</h2>
              <p className="text-zinc-500 font-medium text-base md:text-lg">Secure access to your smart dashboard.</p>
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
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Identity Uplink</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 transition-colors group-focus-within:text-accent">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@nexus.com"
                    className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.2em] ml-1">Access Protocol</label>
                  <Link href="/forgot" className="text-accent text-[10px] md:text-xs font-bold hover:underline underline-offset-4 tracking-tight">Forgot Key?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 transition-colors group-focus-within:text-accent">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-5 py-4 min-h-[52px] rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="premium-button w-full py-5 text-sm font-black tracking-[0.1em] uppercase flex items-center justify-center gap-3 mt-4 shadow-xl active:scale-95 transition-transform"
              >
                Initialize Session <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-10 md:mt-12 text-center pb-8 md:pb-0">
              <p className="text-zinc-600 text-sm font-medium">
                Not a member yet?{" "}
                <Link href="/signup" className="text-white font-black hover:text-accent transition-colors underline md:no-underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
