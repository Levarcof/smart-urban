"use client"
import Link from "next/link"
import Navbar from "../components/Navbar"
import { MapPin, Trash2, HeartPulse, ArrowRight } from "lucide-react"

export default function Home() {

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen w-full text-white overflow-hidden bg-[#02040a]">
        
        {/* --- DYNAMIC BACKGROUND ATMOSPHERE --- */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-900/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 60H0V0h60v60zM1 59h58V1H1v58z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          
          {/* --- HERO SECTION --- */}
          <div className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Live City Protocol v2.0</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Transforming Cities <br />
              <span className="text-emerald-500 italic font-medium">into Smart Spaces.</span>
            </h1>
            
            <p className="mt-4 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Experience a unified AI ecosystem designed for smarter routes, 
              cleaner neighborhoods, and priority healthcare access.
            </p>
          </div>

          {/* --- FEATURE CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* SMART ROUTE */}
            <Link
              href="/smartRoute"
              className="group relative flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 lg:p-10 hover:bg-emerald-500/[0.02] hover:border-emerald-500/40 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 group-hover:rotate-6 shadow-xl">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform">
                Smart Route
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8 group-hover:text-zinc-300 transition-colors">
                Navigate the urban jungle with AI-optimized paths that factor in real-time safety and traffic density.
              </p>
              <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 opacity-0 group-hover:opacity-100 transition-all">
                Launch Map <ArrowRight size={14} />
              </div>
              {/* Card Glow Effect */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
            </Link>

            {/* REPORT GARBAGE */}
            <Link
              href="/garbadgeReport"
              className="group relative flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 lg:p-10 hover:bg-emerald-500/[0.02] hover:border-emerald-500/40 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 group-hover:rotate-6 shadow-xl">
                <Trash2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform">
                City Clean
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8 group-hover:text-zinc-300 transition-colors">
                Contribute to a greener city. Report sanitation issues with instant geolocation for rapid response teams.
              </p>
              <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 opacity-0 group-hover:opacity-100 transition-all">
                Report Issue <ArrowRight size={14} />
              </div>
              <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
            </Link>

            {/* HEALTH CARE */}
            <Link
              href="/health"
              className="group relative flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 lg:p-10 hover:bg-emerald-500/[0.02] hover:border-emerald-500/40 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 group-hover:rotate-6 shadow-xl">
                <HeartPulse size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform">
                Pulse Health
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8 group-hover:text-zinc-300 transition-colors">
                In emergencies, every second counts. Connect to the nearest medical facilities and trauma centers instantly.
              </p>
              <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 opacity-0 group-hover:opacity-100 transition-all">
                Find Care <ArrowRight size={14} />
              </div>
              <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
            </Link>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}