"use client"

import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import Navbar from "../components/Navbar"
import { Navigation, MapPin, Trash2, Heart, AlertTriangle, CheckCircle, Sparkles, Activity, Zap, Shield, ArrowRight, Info, Loader2 } from "lucide-react"

export default function ReportPage() {
  const { user } = useUser()

  const [selectedIssue, setSelectedIssue] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [address, setAddress] = useState("")
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)

  // 📍 Get Current Location + Address
  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude

      setLocation({ lat, lng })

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const data = await res.json()
        setAddress(data.display_name)
      } catch (err) {
        setAddress("Coordinates established: Vector " + lat.toFixed(4) + ", " + lng.toFixed(4))
      }
    })
  }, [])

  // 🚨 Submit Report
  const submitReport = async () => {
    let finalMessage = selectedIssue

    if (!finalMessage) return alert("⚠️ Operation Denied: Issue classification required.")

    if (selectedIssue === "Other" && !customMessage.trim()) {
      return alert("⚠️ Protocol Mismatch: Descriptive payload missing.")
    }

    if (selectedIssue === "Other") {
      finalMessage = customMessage
    }

    setLoading(true)

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "Anonymous Operative",
          email: user?.email || "N/A",
          message: finalMessage,
          address: address || "Remote Sensor Node",
          location,
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (data.success) {
        alert("✅ Signal Transmitted: Civic instability data integrated.")
        setSelectedIssue("")
        setCustomMessage("")
      } else {
        alert("❌ Transmission Failure: Core signal lost.")
      }
    } catch (err) {
      setLoading(false)
      alert("❌ Critical Error: Uplink disconnected.")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <Navbar />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[100%] md:w-[60%] h-[60%] bg-accent/10 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[100%] md:w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      {/* ===== PAGE HUD ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-32 pb-24">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ================= LEFT INFO PANEL ================= */}
          <div className="lg:col-span-5 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">

            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-4 md:mb-6 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent-secondary">
                <Sparkles size={14} /> Nexus Intake Terminal
              </div>
              <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4 md:mb-6 uppercase italic">
                Civic <br className="hidden md:block" />
                <span className="text-gradient">Disruption Log</span>
              </h1>
              <p className="text-zinc-500 text-sm md:text-lg font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Aggregating real-time telemetry on urban instabilities. Report traffic anomalies, structural failures, or sanitation breaches directly to the regional core.
              </p>
            </div>

            {/* USER CARD */}
            <div className="glass-card p-8 md:p-10 border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/50 to-transparent" />

              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl font-black text-accent shadow-inner">
                  {user?.name?.[0] || "O"}
                </div>

                <div>
                  <p className="text-lg md:text-xl font-bold text-white tracking-tight">{user?.name || "Operative Zero"}</p>
                  <p className="text-[11px] md:text-sm text-zinc-500 font-bold uppercase tracking-widest">{user?.email || "auth_low_clearance"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl glass border-white/5 bg-white/[0.02]">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <div className="text-[10px] md:text-xs text-zinc-400 font-medium leading-relaxed">
                  <p className="text-white/40 uppercase tracking-widest font-black text-[8px] mb-1">Current Coordinates</p>
                  <span className="font-bold line-clamp-2">{address || "Establishing telemetry link..."}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 glass-card p-5 md:p-6 border-white/5 bg-accent/5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={24} className="md:size-6" />
              </div>
              <p className="text-[9px] md:text-[10px] text-zinc-500 font-black uppercase tracking-[0.1em] leading-loose">
                All transmissions are cryptographically signed and routed to relevant Nexus infrastructure nodes for rapid response.
              </p>
            </div>

          </div>

          {/* ================= RIGHT FORM PANEL ================= */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="glass-card p-8 lg:p-14 border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] -z-10" />

              <div className="relative z-10">

                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase italic">Classification</h2>
                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-accent-secondary uppercase tracking-widest">
                    <Activity size={12} className="animate-pulse" /> Live Link
                  </div>
                </div>

                {/* ISSUE OPTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">

                  {[
                    { label: "Traffic Anomaly", value: "Traffic Jam", icon: <Navigation size={18} /> },
                    { label: "Kinetic Incident", value: "Accident", icon: <Zap size={18} /> },
                    { label: "Structural Breach", value: "Road Damage", icon: <Shield size={18} /> },
                    { label: "Civic Flux", value: "Garbage Problem", icon: <Trash2 size={18} /> },
                    { label: "Resource Leak", value: "Water Leakage", icon: <Activity size={18} /> },
                    { label: "Custom Protocol", value: "Other", icon: <AlertTriangle size={18} /> },
                  ].map((issue, i) => (
                    <label
                      key={i}
                      className={`group flex items-center gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-500 border
                      ${selectedIssue === issue.value
                          ? "bg-accent/20 border-accent/40 shadow-xl shadow-accent/10 scale-[1.02]"
                          : "glass border-white/5 hover:border-white/20 active:scale-98"
                        }`}
                    >
                      <input
                        type="radio"
                        name="issue"
                        value={issue.value}
                        checked={selectedIssue === issue.value}
                        onChange={(e) => setSelectedIssue(e.target.value)}
                        className="hidden"
                      />
                      <div className={`p-2.5 md:p-3 rounded-xl transition-colors duration-500 ${selectedIssue === issue.value ? "bg-accent text-white" : "bg-white/5 text-zinc-500 group-hover:text-white"}`}>
                        {issue.icon}
                      </div>
                      <span className={`font-black uppercase tracking-widest text-[10px] md:text-xs transition-colors duration-500 ${selectedIssue === issue.value ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                        {issue.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* CUSTOM MESSAGE */}
                {selectedIssue === "Other" && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                    <textarea
                      placeholder="Input comprehensive disruption analysis..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={4}
                      className="w-full glass border-white/5 rounded-2xl p-5 md:p-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-sm md:text-base font-bold font-sans outline-none"
                    />
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  onClick={submitReport}
                  disabled={loading}
                  className="w-full py-5 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all duration-700 relative overflow-hidden group premium-button text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> Integrating Payload...
                      </>
                    ) : (
                      <>
                        Transmit Log Signal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                <div className="mt-8 flex items-center justify-center gap-3 text-zinc-700">
                  <Info size={14} />
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                    All transmissions are monitored for accuracy and integrity.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
