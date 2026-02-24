"use client"
import Link from "next/link"
import Navbar from "../components/Navbar"
import { MapPin, Trash2, HeartPulse, ArrowRight, Shield, Globe, Zap, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="relative md:mt-[-70px] mt-[-100px] min-h-screen w-full bg-background text-foreground overflow-hidden font-sans">

        {/* --- DYNAMIC BACKGROUND ATMOSPHERE --- */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[100%] md:w-[70%] h-[70%] bg-accent/20 rounded-full blur-[80px] md:blur-[140px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[100%] md:w-[60%] h-[60%] bg-accent-secondary/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

          {/* Floating Accents */}
          <div className="absolute top-[20%] right-[15%] w-32 h-32 bg-accent/30 rounded-full blur-[60px] animate-bounce-subtle"></div>
          <div className="absolute bottom-[20%] left-[15%] w-40 h-40 bg-accent-secondary/20 rounded-full blur-[80px] animate-bounce-subtle" style={{ animationDelay: '1.5s' }}></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.05] mask-gradient-b" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 40H0V0h40v40zM1 39h38V1H1v38z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 md:pt-44 pb-32">

          {/* --- HERO SECTION --- */}
          <div className="text-center max-w-5xl mx-auto mb-10 md:mb-28">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/10 mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-accent"></span>
              </span>
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] text-accent-secondary">Urban Intel v4.2</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] md:leading-[0.95] mb-2 md:mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Transforming Cities <br />
              <span className="text-gradient text-sm md:text-xl">into Living Spaces.</span>
            </h1>

            <p className="mt-1 md:mt-4 text-zinc-400 text-base md:text-xl text-sm max-w-2xl mx-auto  leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Experience a unified AI ecosystem designed for seamless mobility,
              sustainable living, and intelligent medical coordination.
            </p>

            {/* <div className="mt-8 md:mt-12 flex flex sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link href="/about" className="premium-button w-[70%] sm:w-auto flex items-center justify-center gap-2 py-1">
                Explore Protocol <ArrowRight size={18} />
              </Link>
              <Link href="/profile" className="w-[50%] sm:w-auto  py-3 px-3 rounded-2xl glass font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-sm uppercase tracking-widest text-center">
                 Dashboard
              </Link>
            </div> */}
          </div>

          {/* --- FEATURE CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">

            {/* SMART ROUTE */}
            <Link
              href="/smartRoute"
              className="group relative flex flex-col glass-card p-8 md:p-10 lg:p-12 hover-glow transition-all duration-500 min-h-[280px]"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 md:mb-10 border border-white/5 group-hover:bg-accent group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-2xl">
                <MapPin size={24} className="md:w-7 md:h-7" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:translate-x-1 transition-transform">
                Neural Routes
              </h2>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-8 md:mb-10 group-hover:text-zinc-300 transition-colors">
                Navigate with AI-optimized paths that synchronize real-time traffic flux and structural safety metrics.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent opacity-60 group-hover:opacity-100 transition-all">
                Access Grid <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* REPORT GARBAGE */}
            <Link
              href="/garbadgeReport"
              className="group relative flex flex-col glass-card p-8 md:p-10 lg:p-12 hover-glow transition-all duration-500 min-h-[280px]"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 md:mb-10 border border-white/5 group-hover:bg-accent-secondary group-hover:text-white transition-all duration-500 group-hover:-rotate-6 shadow-2xl">
                <Trash2 size={24} className="md:w-7 md:h-7" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:translate-x-1 transition-transform">
                Civic Pulse
              </h2>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-8 md:mb-10 group-hover:text-zinc-300 transition-colors">
                Maintain urban equilibrium. Report sanitation anomalies with precision geolocation for rapid deployment.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary opacity-60 group-hover:opacity-100 transition-all">
                Report Flux <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* HEALTH CARE */}
            <Link
              href="/health"
              className="group relative flex flex-col glass-card p-8 md:p-10 lg:p-12 hover-glow transition-all duration-500 min-h-[280px]"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 md:mb-10 border border-white/5 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-2xl">
                <HeartPulse size={24} className="md:w-7 md:h-7" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:translate-x-1 transition-transform">
                Bio Response
              </h2>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-8 md:mb-10 group-hover:text-zinc-300 transition-colors">
                Immediate medical synchronization. Locate the nearest trauma centers and specialized health nodes with zero latency.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 opacity-60 group-hover:opacity-100 transition-all">
                Scan Nodes <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

          {/* --- STATS SECTION --- */}
          <div className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            {[
              { label: "Neural Nodes", val: "1.2M+", icon: <Globe size={16} className="md:w-[18px]" /> },
              { label: "Active Ops", val: "85K+", icon: <Zap size={16} className="md:w-[18px]" /> },
              { label: "Integrity", val: "99.9%", icon: <Shield size={16} className="md:w-[18px]" /> },
              { label: "Innovations", val: "240+", icon: <Sparkles size={16} className="md:w-[18px]" /> }
            ].map((stat, i) => (
              <div key={i} className="text-center group p-2">
                <div className="inline-flex items-center gap-2 text-zinc-500 mb-1 md:mb-2 group-hover:text-accent transition-colors">
                  {stat.icon}
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-xl md:text-3xl font-bold text-white tracking-tight">{stat.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 6s ease-in-out infinite;
        }
        .mask-gradient-b {
          mask-image: linear-gradient(to bottom, black, transparent);
        }
      `}</style>
    </>
  )
}