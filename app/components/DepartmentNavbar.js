"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DepartmentNavbar() {
    const { user } = useUser();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // close dropdown when click outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // logout function
const handleLogout = async () => {
    try {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        if (res.ok) {
            router.replace("/login"); // ✅ better than push
        }
    } catch (err) {
        console.log("Logout error:", err);
    }
};


    return (
        <nav className="w-full relative z-50 h-16 px-6 flex items-center justify-between bg-black/70 backdrop-blur-xl border-b border-green-500/20 shadow-lg">

            {/* Left Logo */}
            <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold text-black">
                    ♻️
                </div>
                <Link href="/department">
                    <h1 className="text-lg md:text-xl font-bold text-green-400 tracking-wide">
                        Smart City
                    </h1>
                </Link>
            </div>

            {/* Right Profile */}
            <div className="relative" ref={dropdownRef}>
                <img
                    src={user?.image || "/default-avatar.png"}
                    alt="profile"
                    onClick={() => setOpen(!open)}
                    className="w-10 h-10 rounded-full border-2 border-green-400 cursor-pointer hover:scale-105 transition"
                />

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-green-500/30 rounded-xl shadow-xl overflow-hidden animate-fadeIn">

                        {/* User Info */}
                        <div className="p-4 flex items-center gap-3 border-b border-zinc-800">
                            <img
                                src={user?.image || "/default-avatar.png"}
                                className="w-12 h-12 rounded-full border border-green-400"
                            />
                            <div>
                                <p className="text-sm font-semibold text-green-400">
                                    {user?.name || "Department"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => router.push("/departmentProfile")}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-green-500/10 transition"
                            >
                                <User size={16} /> View Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
