"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "../context/UserContext"
import { useRouter } from "next/navigation"
import { Menu, X, Home, Info, LayoutDashboard, User, LogOut, Bell, ChevronRight } from "lucide-react"

const Navbar = () => {
  const router = useRouter()
  const { user, setUser, loading } = useUser()

  const [showProfile, setShowProfile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const profileRef = useRef(null)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setShowSidebar(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        setUser(null)
        router.push("/login")
        setShowProfile(false)
      }
    } catch (error) {
      console.log("Logout error:", error)
    }
  }

  return (
    <>
      {/* Header - Floating Pill Design */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? "bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2" 
            : "bg-transparent py-4"
        } rounded-2xl md:rounded-[2rem]`}
      >
        <div className="flex items-center justify-between px-6 md:px-10">
          
          {/* Logo with Glow Effect */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
               <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-white font-black text-xl md:text-2xl tracking-tighter italic">
              SMART<span className="text-emerald-500 not-italic">CIVIC</span>
            </span>
          </Link>

          {/* Desktop Navigation - Minimalist Labels */}
          <nav className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-full px-2 py-1 gap-1">
            {[
              { path: "/", name: "Home" },
              { path: "/about", name: "About" },
              { path: "/profile", name: "Profile" }
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.path}
                className="px-6 py-2 rounded-full text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all duration-300 group relative"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-1/2" />
              </Link>
            ))}
            {!loading && user?.role === "admin" && (
              <Link
                href="/dashboard"
                className="px-6 py-2 rounded-full text-emerald-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-500/10 transition-all border border-emerald-500/20 ml-2"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Icon */}
            <Link href="/notification">
              <button className="relative p-2.5 rounded-full bg-zinc-900 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all active:scale-90">
                <Bell size={18} className="text-zinc-400" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-500 rounded-full ring-4 ring-zinc-950"></span>
              </button>
            </Link>

            {/* Profile Trigger */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 pl-1 pr-1 md:pr-4 py-1 rounded-full bg-zinc-900 border border-white/5 hover:border-emerald-500/30 transition-all active:scale-95"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-emerald-500/20 shadow-inner">
                  <Image
                    src={user?.image || "/default.png"}
                    alt="user"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden md:block text-xs font-bold text-zinc-300 max-w-[80px] truncate uppercase tracking-tighter">
                  {user?.name?.split(' ')[0] || "Guest"}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfile && (
                <div className="absolute right-0 mt-4 w-64 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-transparent">
                    <p className="font-black text-white text-lg tracking-tight truncate">{user?.name || "Guest User"}</p>
                    <p className="text-zinc-500 text-xs font-medium truncate">{user?.email || "No account linked"}</p>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center justify-between px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[10px]">
                        <User size={14} className="text-emerald-500" /> My Profile
                      </span>
                      <ChevronRight size={14} className="text-zinc-600" />
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all text-sm font-bold uppercase tracking-widest text-[10px]"
                    >
                      <LogOut size={14} /> Logout Session
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Burger */}
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2.5 rounded-full bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 transition-transform active:scale-90"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-[60] animate-in fade-in duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-zinc-950 border-r border-white/5 text-white z-[70] transform transition-transform duration-500 ease-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-10 border-b border-white/5">
          <span className="text-2xl font-black tracking-tighter italic">
            SMART<span className="text-emerald-500 not-italic">CIVIC</span>
          </span>
          <button onClick={() => setShowSidebar(false)} className="p-2 rounded-full hover:bg-white/5">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col mt-6 px-4 space-y-2">
          {[
            { name: "Home", href: "/", icon: <Home size={20} /> },
            { name: "About", href: "/about", icon: <Info size={20} /> },
            { name: "Profile", href: "/profile", icon: <User size={20} /> },
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              onClick={() => setShowSidebar(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-zinc-400 hover:text-white hover:bg-emerald-500/10 font-bold uppercase text-xs tracking-widest transition-all"
            >
              <span className="text-emerald-500">{link.icon}</span> {link.name}
            </Link>
          ))}
          {!loading && user?.role === "admin" && (
            <Link
              href="/dashboard"
              onClick={() => setShowSidebar(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-emerald-500/5 text-emerald-400 font-bold uppercase text-xs tracking-widest border border-emerald-500/10"
            >
              <LayoutDashboard size={20} /> Dashboard
            </Link>
          )}
        </div>

        <div className="absolute bottom-10 left-0 right-0 px-8">
           <div className="h-px w-full bg-white/5 mb-6" />
           <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] text-center">
             Ver 2.0.4 • © 2026
           </p>
        </div>
      </div>
    </>
  )
}

export default Navbar