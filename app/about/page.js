"use client";

import React from "react";
import Navbar from "../components/Navbar";
import {
  Trash2,
  Shield,
  Users,
  Activity,
  Sparkles,
  Zap,
  Globe,
  ArrowRight,
  ShieldCheck,
  Settings,
  LayoutDashboard,
  FileText,
  CheckCircle,
  Layers,
  Server,
  Code2,
  Cloud,
  MousePointer2,
  Smartphone
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden">
      <Navbar />

      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[100%] md:w-[60%] h-[60%] bg-accent/10 rounded-full blur-[80px] md:blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[100%] md:w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-5 md:pt-32 pb-24">

        {/* ================= SECTION 1: INTRODUCTION ================= */}
        <section className="mb-10 md:mb-32 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-6 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent-secondary">
            <Sparkles size={14} /> Platform Documentation
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-6 uppercase italic">
            What is <span className="text-gradient">SmartCivic?</span>
          </h1>
          <div className="glass-card p-8 md:p-10 border-white/5 bg-accent/5">
            <p className="text-zinc-400 text-sm md:text-lg font-medium leading-relaxed max-w-4xl">
              SmartCivic is a next-generation urban management ecosystem designed to bridge the gap between citizens and municipal authorities. By leveraging real-time telemetry, advanced geospatial data, and role-based intervention protocols, the platform ensures rapid response to civic instabilities such as sanitation breaches and infrastructure anomalies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                { label: "Community Driven", desc: "Citizen-centric reporting and feedback loops." },
                { label: "Role-Based Access", desc: "Secure workflows for Admins and Departments." },
                { label: "Real-Time Sync", desc: "Instantaneous signal transmission across nodes." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">{item.label}</span>
                  <p className="text-zinc-500 text-xs md:text-sm font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: CORE FEATURES ================= */}
        <section className="mb-20 md:mb-32">
          <div className="flex items-center gap-4 mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Core <span className="text-gradient">Features</span></h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Garbage Reporting",
                icon: <Trash2 size={24} />,
                color: "text-accent",
                points: ["High-res image uplink", "Automatic location capture", "Classification protocols", "Secure submission"]
              },
              {
                title: "Status Intelligence",
                icon: <Activity size={24} />,
                color: "text-accent-secondary",
                points: ["Pending verification", "In-progress tracking", "Resolution validation", "Neural status logs"]
              },
              {
                title: "Department Hub",
                icon: <Settings size={24} />,
                color: "text-emerald-500",
                points: ["Task assignment", "Response telemetry", "Photo-evidence verification", "Status synchronization"]
              },
              {
                title: "Admin Terminal",
                icon: <LayoutDashboard size={24} />,
                color: "text-red-500",
                points: ["Universal oversight", "User entity management", "Global statistics", "Secure moderation"]
              },
              {
                title: "Operative Dashboard",
                icon: <FileText size={24} />,
                color: "text-blue-500",
                points: ["Personal report tracking", "System alerts", "Identity configuration", "Profile management"]
              },
              {
                title: "Notifications",
                icon: <Globe size={24} />,
                color: "text-amber-500",
                points: ["Real-time signal feed", "Protocol alerts", "Department updates", "System status pings"]
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 md:p-8 border-white/5 hover:border-accent/20 transition-all duration-500 group">
                <div className={`w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black text-white mb-4 italic uppercase">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.points.map((point, pi) => (
                    <li key={pi} className="flex items-center gap-3 text-zinc-500 text-[11px] md:text-sm font-medium">
                      <CheckCircle size={14} className="text-accent/40 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 3: HOW IT WORKS ================= */}
        <section className="mb-20 md:mb-32 relative">
          <div className="flex items-center gap-4 mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">System <span className="text-gradient">Architecture</span></h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="relative space-y-12 md:space-y-24 max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent-secondary/50 to-transparent md:-translate-x-1/2" />

            {[
              { step: "01", title: "Intake", desc: "Citizen identifies an anomaly and initiates a report protocol with geospatial and visual data." },
              { step: "02", title: "Verification", desc: "System administrators review the incoming signal for integrity and classify the disruption." },
              { step: "03", title: "Assignment", desc: "Operational data is routed to the specialized department node for localized intervention." },
              { step: "04", title: "Intervention", desc: "Assigned departmental operatives respond to the site and execute resolution protocols." },
              { step: "05", title: "Validation", desc: "Final resolution proof is uploaded and verified against the initial disruption log." },
              { step: "06", title: "Synchronization", desc: "Status is globally updated and the reporting operative is notified via the signal feed." }
            ].map((item, i) => (
              <div key={i} className={`relative flex items-center gap-8 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="md:w-1/2" />
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass border-accent/40 flex items-center justify-center bg-background z-20">
                  <span className="text-[10px] font-black text-accent">{item.step}</span>
                </div>
                <div className={`md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? "md:pl-20" : "md:pr-20 md:text-right"}`}>
                  <div className="glass-card p-6 md:p-8 border-white/5 hover:border-accent/10 transition-all duration-500">
                    <h4 className="text-lg font-black text-white mb-2 uppercase italic tracking-tight">{item.title}</h4>
                    <p className="text-zinc-500 text-xs md:text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 4: SECURITY ================= */}
        <section className="mb-20 md:mb-32">
          <div className="glass-card p-8 md:p-14 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] -z-10" />
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck size={64} className="md:w-20 md:h-20" />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight">Security & <span className="text-gradient">Integrity</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <LockIcon size={14} className="text-accent" /> Role-Based Access
                    </span>
                    <p className="text-zinc-500 text-[11px] md:text-sm font-medium">Strict separation of citizen, department, and admin permissions.</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <Server size={14} className="text-accent" /> Protected API
                    </span>
                    <p className="text-zinc-500 text-[11px] md:text-sm font-medium">JWT auth and server-side validation for every transmission.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: TECH STACK ================= */}
        <section className="mb-20 md:mb-32">
          <div className="flex items-center gap-4 mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Infrastructure <span className="text-gradient">Stack</span></h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Frontend", val: "Next.js / React", icon: <LayoutDashboard size={20} /> },
              { label: "Styling", val: "Tailwind CSS", icon: <Code2 size={20} /> },
              { label: "Backend", val: "API Routes", icon: <Server size={20} /> },
              { label: "Database", val: "MongoDB", icon: <Layers size={20} /> },
              { label: "Imagery", val: "Cloudinary", icon: <Cloud size={20} /> },
              { label: "Icons", val: "Lucide React", icon: <Activity size={20} /> },
              { label: "Deployment", val: "Vercel", icon: <Globe size={20} /> },
              { label: "Security", val: "JWT Protocols", icon: <Shield size={20} /> }
            ].map((tech, i) => (
              <div key={i} className="glass border-white/5 p-4 md:p-6 rounded-2xl hover:bg-white/[0.03] transition-all">
                <div className="text-accent mb-3">{tech.icon}</div>
                <p className="text-zinc-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">{tech.label}</p>
                <p className="text-white font-bold text-xs md:text-sm tracking-tight">{tech.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 6: HOW TO USE ================= */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="flex items-center gap-4 mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Usage <span className="text-gradient">Guidelines</span></h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                role: "Citizens",
                icon: <Smartphone size={24} />,
                steps: ["Authorize profile account", "Navigate to Intake Terminal", "Upload disruption data", "Monitor status updates"]
              },
              {
                role: "Admins",
                icon: <LayoutDashboard size={24} />,
                steps: ["Access Control Center", "Verify incoming signals", "Calibrate department nodes", "Oversee global integrity"]
              },
              {
                role: "Departments",
                icon: <MousePointer2 size={24} />,
                steps: ["Review assigned anomalies", "Initiate site intervention", "Upload resolution proof", "Synchronize node status"]
              }
            ].map((role, i) => (
              <div key={i} className="glass-card p-8 md:p-10 border-white/5 bg-accent/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{role.role}</h3>
                </div>
                <div className="space-y-6">
                  {role.steps.map((step, si) => (
                    <div key={si} className="flex gap-4">
                      <span className="text-accent/30 font-black text-[10px] mt-0.5">0{si + 1}</span>
                      <p className="text-zinc-500 text-xs md:text-sm font-medium leading-tight">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style jsx>{`
        .glass { @apply bg-white/5 backdrop-blur-xl border border-white/10; }
        .glass-card { @apply bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] md:rounded-[2.5rem]; }
        .text-gradient { @apply bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-secondary; }
      `}</style>
    </div>
  );
}

const LockIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
