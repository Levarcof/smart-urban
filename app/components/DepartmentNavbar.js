"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { LogOut, User, Sparkles, ChevronRight, Settings, Home, Bell } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function DepartmentNavbar() {
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

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

    const navLinks = [
        { path: "/department", name: "Command", icon: <Home size={20} /> },
        { path: "/departmentProfile", name: "Identity", icon: <User size={20} /> }
    ];

    return (
        <>
            {/* --- TOP HEADER (COMPACT ON MOBILE) --- */}
            <nav className="fixed top-0 md:top-4 left-1/2 -translate-x-1/2 w-full md:w-[95%] max-w-7xl z-50 glass py-2 md:py-3 px-6 md:px-8 shadow-premium flex items-center justify-between md:rounded-3xl">
                {/* Left Logo */}
                <div className="flex items-center gap-2 md:gap-3 group">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300">
                        <Sparkles size={18} className="text-white md:hidden" />
                        <Sparkles size={24} className="text-white hidden md:block" />
                    </div>
                    <Link href="/department">
                        <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">
                            Smart<span className="text-accent">Civic</span> <span className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase ml-1 tracking-widest">Dept</span>
                        </h1>
                    </Link>
                </div>

                {/* Right Profile */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 p-1 pr-1 md:pr-3 rounded-xl glass hover-glow transition-all active:scale-95"
                    >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg overflow-hidden border border-white/10">
                            <img
                                src={user?.image || "https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="hidden lg:block text-sm font-medium text-zinc-300 max-w-[120px] truncate">
                            {user?.name || "Department"}
                        </span>
                    </button>

                    {/* Dropdown */}
        {open && (
  <div className="absolute right-0 mt-4 w-64 z-[9999]">

    <div
      className="
        bg-zinc-950
        border border-white/10
        rounded-2xl
        shadow-[0_25px_80px_rgba(0,0,0,0.8)]
        ring-1 ring-white/5
        p-2
        animate-in fade-in zoom-in-95 duration-200
      "
    >

      {/* User Info */}
      <div className="p-4 border-b border-white/5 mb-2">
        <p className="font-bold text-white truncate">
          {user?.name || "Department"}
        </p>
        <p className="text-zinc-400 text-xs truncate">
          {user?.email}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-1">

        <Link
          href="/departmentProfile"
          onClick={() => setOpen(false)}
          className="w-full flex items-center justify-between px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <span className="flex items-center gap-3 text-sm">
            <User size={18} className="text-accent" /> Profile
          </span>
          <ChevronRight size={16} className="text-zinc-600" />
        </Link>

        <div className="h-px bg-white/5 my-1 mx-2" />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut size={18} /> Logout
        </button>

      </div>
    </div>
  </div>
)}
                </div>
            </nav>

            {/* --- MOBILE BOTTOM NAVIGATION --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 px-2 pb-safe">
                <div className="flex items-center justify-around h-16 relative">
                    {navLinks.map((item, idx) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={idx}
                                href={item.path}
                                className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative ${isActive ? "text-accent" : "text-zinc-500"}`}
                            >
                                {isActive && (
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-full animate-in slide-in-from-top-2" />
                                )}
                                {item.icon}
                                <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Spacer */}
            <div className="md:hidden h-16 pb-safe" />
        </>
    );
}
