"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "../context/UserContext"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Home, Info, LayoutDashboard, User, LogOut, Bell, ChevronRight, Settings, Sparkles, Activity } from "lucide-react"

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, setUser, loading } = useUser()

  const [showProfile, setShowProfile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const profileRef = useRef(null)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
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

  const navLinks = [
    { path: "/", name: "Home", icon: <Home size={20} /> },
    { path: "/about", name: "About", icon: <Info size={20} /> },
    { path: "/profile", name: "Profile", icon: <User size={20} /> }
  ]

  const isAdminOrDept = !loading && (user?.role === "admin" || user?.role === "department")
  const dashboardPath = user?.role === "admin" ? "/dashboard" : "/department"

  return (
    <>
      {/* --- TOP HEADER (COMPACT ON MOBILE) --- */}
      <header
        className={`fixed top-0 md:top-4 left-1/2 -translate-x-1/2 w-full md:w-[95%] max-w-7xl z-50 transition-all duration-500 ease-out ${scrolled || typeof window !== 'undefined' && window.innerWidth < 768
          ? "glass py-2 md:py-3 shadow-premium md:rounded-3xl"
          : "bg-transparent py-4 md:py-6"
          }`}
      >
        <div className="flex items-center justify-between px-6 md:px-8">

          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300">
              <Sparkles size={18} className="text-white md:hidden" />
              <Sparkles size={24} className="text-white hidden md:block" />
            </div>
            <span className="text-white font-bold text-lg md:text-2xl tracking-tight">
              Smart<span className="text-accent">Civic</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center glass border-white/5 rounded-full px-1 py-1 gap-1">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 group relative ${pathname === item.path ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
              >
                {React.cloneElement(item.icon, { size: 16 })}
                {item.name}
                {pathname === item.path && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-accent rounded-full" />
                )}
              </Link>
            ))}
            {isAdminOrDept && (
              <Link
                href={dashboardPath}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-accent font-semibold text-sm hover:bg-accent/10 transition-all border border-accent/20 ml-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/notification">
              <button className="relative p-2.5 md:p-3 rounded-xl glass hover-glow transition-all active:scale-95">
                <Bell size={18} className="text-zinc-400 md:hidden" />
                <Bell size={20} className="text-zinc-400 hidden md:block" />
                <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2 h-2 bg-accent-secondary rounded-full ring-2 ring-black/40"></span>
              </button>
            </Link>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1 pr-1 md:pr-3 rounded-xl glass hover-glow transition-all active:scale-95"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={user?.image || "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"}
                    alt="user"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden lg:block text-sm font-medium text-zinc-300 max-w-[100px] truncate">
                  {user?.name || "Guest"}
                </span>
              </button>

 {showProfile && (
  <div className="absolute right-0 mt-4 w-64 z-[9999]">

    <div className="
      bg-zinc-950
      border border-white/10
      rounded-2xl
      shadow-[0_25px_80px_rgba(0,0,0,0.8)]
      backdrop-blur-0
      p-2
      animate-in fade-in zoom-in-95 duration-200
    ">

      {/* User Info */}
      <div className="p-4 border-b border-white/5 mb-2">
        <p className="font-bold text-white truncate">
          {user?.name || "Guest User"}
        </p>
        <p className="text-zinc-400 text-xs truncate">
          {user?.email || "No account linked"}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-1">

        <Link
          href="/profile"
          onClick={() => setShowProfile(false)}
          className="flex items-center justify-between px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <span className="flex items-center gap-3 text-sm">
            <User size={18} className="text-accent" /> Profile
          </span>
          <ChevronRight size={16} className="text-zinc-600" />
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut size={18} /> Logout
        </button>

      </div>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </header>

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
          {isAdminOrDept && (
            <Link
              href={dashboardPath}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative ${pathname.startsWith('/dashboard') || pathname.startsWith('/department') ? "text-accent-secondary" : "text-zinc-500"}`}
            >
              {(pathname.startsWith('/dashboard') || pathname.startsWith('/department')) && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent-secondary rounded-full animate-in slide-in-from-top-2" />
              )}
              <LayoutDashboard size={20} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Dash</span>
            </Link>
          )}
        </div>
      </div>

      {/* Spacer to prevent content overlay from bottom nav */}
      <div className="md:hidden h-16 pb-safe" />
    </>
  )
}

export default Navbar