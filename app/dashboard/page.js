"use client"
import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { LayoutDashboard, Search, Zap, Shield, X, Trash2, Image as ImageIcon, MapPin, Clock, User, CheckCircle, Plus, Filter, ArrowRight, Loader2 } from "lucide-react"

export default function Page() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("routes")
  const [previewImage, setPreviewImage] = useState(null)

  // ✅ DELETE MODAL STATES
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
  })

  const [adminEmail, setAdminEmail] = useState("")
  const [adminLoading, setAdminLoading] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)

  const getApiUrl = () => {
    if (activeTab === "routes") return "/api/report/all"
    if (activeTab === "garbage") return "/api/garbage/all"
  }

  const getDeleteApi = () => {
    if (activeTab === "routes") return "/api/report/solve"
    if (activeTab === "garbage") return "/api/garbage/solve"
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await fetch(getApiUrl())
      const data = await res.json()
      setReports(data.reports || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    const res = await fetch("/api/users/state")
    const data = await res.json()
    setStats(data)
  }

  useEffect(() => {
    fetchReports()
  }, [activeTab])

  useEffect(() => {
    fetchStats()
  }, [])

  const filteredReports = reports.filter((r) => {
    const createdAt = new Date(r.createdAt)
    const today = new Date()

    if (filter === "today") return createdAt.toDateString() === today.toDateString()
    if (filter === "month") {
      const lastMonth = new Date()
      lastMonth.setMonth(today.getMonth() - 1)
      return createdAt >= lastMonth
    }

    if (search) {
      return (
        r.address?.toLowerCase().includes(search.toLowerCase()) ||
        r.message?.toLowerCase().includes(search.toLowerCase()) ||
        r.name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    return true
  })

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }

  const resolveReport = async () => {
    if (!deleteId) return
    setLoading(true)
    try {
      const res = await fetch(getDeleteApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      })
      const data = await res.json()
      if (data.success) fetchReports()
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
    setDeleteModal(false)
    setDeleteId(null)
  }

  const createAdmin = async () => {
    if (!adminEmail) return alert("Enter email first")
    setAdminLoading(true)
    try {
      const res = await fetch("/api/makeAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      })
      const data = await res.json()
      alert(data.message)
      setAdminEmail("")
      setShowAdminModal(false)
      fetchStats()
    } catch (err) {
      console.log(err)
    }
    setAdminLoading(false)
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-6 md:pt-28 pb-24 md:pb-20 w-full bg-background font-sans">
        {/* Background Atmosphere */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[100%] md:w-[50%] h-[50%] bg-accent/5 rounded-full blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[100%] md:w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

          {/* HEADER AREA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <div className="flex items-center gap-2 text-accent font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-2 md:mb-3">
                <LayoutDashboard size={14} /> Control Center
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                City <span className="text-gradient">Dashboard</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="relative group w-full sm:w-auto">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-accent transition-colors" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Query system files..."
                  className="pl-12 pr-6 py-3 md:py-3.5 rounded-2xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all w-full md:w-[300px]"
                />
              </div>
              <button
                onClick={() => setShowAdminModal(true)}
                className="premium-button flex items-center justify-center gap-2 group py-3 md:py-3.5 w-full sm:w-auto text-[10px] md:text-xs font-black uppercase tracking-widest"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                Elevate Authority
              </button>
            </div>
          </div>

          {/* TAB & FILTER BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-8 md:mb-10 glass p-2 rounded-2xl border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="flex gap-1 p-1 bg-black/20 rounded-[14px] w-full md:w-auto">
              {[
                { key: "routes", label: "Neural Routes", icon: <MapPin size={16} /> },
                { key: "garbage", label: "Civic Flux", icon: <Trash2 size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${activeTab === tab.key
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    }`}
                >
                  {tab.icon} <span className="hidden xs:inline">{tab.label}</span> {tab.key === "routes" && <span className="xs:hidden">Routes</span>} {tab.key === "garbage" && <span className="xs:hidden">Flux</span>}
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide py-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/5 shrink-0">
                <Filter size={14} className="text-zinc-500" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Filters</span>
              </div>
              {["all", "today", "month"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f
                    ? "bg-accent/10 border border-accent/30 text-accent"
                    : "bg-white/5 border border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                    }`}
                >
                  {f === "all" ? "Core Data" : f === "today" ? "Recent" : "Monthly"}
                </button>
              ))}
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            {[
              { label: "Active Nodes", value: reports.length, icon: <Zap size={18} />, color: "text-accent" },
              { label: "Total Synced", value: reports.length, icon: <CheckCircle size={18} />, color: "text-accent-secondary" },
              { label: "Neural Users", value: stats.totalUsers, icon: <User size={18} />, color: "text-blue-400" },
              { label: "Overseers", value: stats.totalAdmins, icon: <Shield size={18} />, color: "text-emerald-400" },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card p-4 md:p-6 border-white/5 hover-glow group transition-all duration-500"
              >
                <div className={`p-2 md:p-2.5 rounded-xl bg-white/5 w-fit mb-3 md:mb-4 ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                <h2 className="text-xl md:text-3xl font-bold text-white mt-1.5 md:mt-2 tracking-tight group-hover:translate-x-1 transition-transform">
                  {item.value}
                </h2>
              </div>
            ))}
          </div>

          {/* MAIN TABLE AREA */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="hidden md:block glass-card border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    {activeTab === "garbage" && <th className="px-8 py-5 text-left font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">Reference</th>}
                    <th className="px-8 py-5 text-left font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">Location Vector</th>
                    {activeTab === "garbage" && <th className="px-8 py-5 text-left font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">Assigned Node</th>}
                    <th className="px-8 py-5 text-left font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">Protocol Details</th>
                    <th className="px-8 py-5 text-left font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">Timestamp</th>
                    <th className="px-8 py-5 text-left font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">Originator</th>
                    <th className="px-8 py-5 text-right font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReports.length > 0 ? filteredReports.map((r) => (
                    <tr key={r._id} className="hover:bg-white/[0.02] transition-colors group">
                      {activeTab === "garbage" && (
                        <td className="px-8 py-5">
                          {r.images ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-accent transition-colors cursor-pointer" onClick={() => setPreviewImage(r.images[0])}>
                              <img src={r.images[0]} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Search size={14} className="text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-700">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </td>
                      )}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-zinc-300 font-bold">
                          <MapPin size={14} className="text-accent" />
                          {r.address}
                        </div>
                      </td>
                      {activeTab === "garbage" && (
                        <td className="px-8 py-5">
                          <div className="px-3 py-1 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-[10px] font-black w-fit uppercase tracking-wider">
                            {r.departments?.[0]?.departmentName || "System Auto"}
                          </div>
                        </td>
                      )}
                      <td className="px-8 py-5 text-zinc-400 max-w-[200px] truncate italic">{r.message}</td>
                      <td className="px-8 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-wider tabular-nums">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-white font-black tracking-widest text-xs uppercase">
                        {r?.name || "System Core"}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => openDeleteModal(r._id)}
                          className="p-3 rounded-xl bg-white/5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all active:scale-90 shadow-lg"
                          title="Resolve Issue"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-10">
                          <LayoutDashboard size={64} />
                          <p className="text-xl font-black uppercase tracking-[0.3em]">No Active Vectors</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden space-y-4">
              {filteredReports.map((r) => (
                <div key={r._id} className="glass-card border-white/5 p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 active:scale-[0.98] transition-all">
                  {activeTab === "garbage" && r.images && (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/5 mb-5 shadow-inner" onClick={() => setPreviewImage(r.images[0])}>
                      <img src={r.images[0]} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-xl text-white border border-white/10">
                        <ImageIcon size={18} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                    <p className="font-bold text-white text-base tracking-tight leading-snug">{r.address}</p>
                  </div>
                  {activeTab === "garbage" && r.departments && (
                    <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-accent-secondary text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Shield size={14} className="text-accent-secondary/60" /> Node: {r.departments[0].departmentName}
                    </div>
                  )}
                  <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mb-6 bg-black/20 p-4 rounded-xl border border-white/5 italic">"{r.message}"</p>
                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 border border-white/5">
                        <User size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-white text-[11px] font-black uppercase tracking-wider">{r?.name || "Anonymous Operative"}</p>
                        <p className="text-zinc-600 text-[9px] font-black tracking-widest tabular-nums uppercase">{new Date(r.createdAt).toLocaleString([], { hour12: false })}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openDeleteModal(r._id)}
                      className="p-3.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 active:scale-90 transition-all shadow-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredReports.length === 0 && (
                <div className="glass-card p-12 text-center border-white/5 opacity-20">
                  <div className="flex flex-col items-center gap-4">
                    <LayoutDashboard size={48} />
                    <p className="text-sm font-black uppercase tracking-widest">No Data Transmissions</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW LIGHTBOX */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12 transition-all animate-in fade-in duration-300">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-black/60 text-white hover:bg-white/10 hover:rotate-90 transition-all duration-300 border border-white/10 z-[110]"
          >
            <X size={24} />
          </button>
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            <img
              src={previewImage}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 p-1 bg-white/[0.02]"
            />
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="glass-card border-white/10 p-8 md:p-10 w-full max-w-md shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
            <div className="w-20 h-20 md:w-20 md:h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6 md:mb-8 animate-pulse">
              <Trash2 size={36} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Finalize Protocol?</h3>
            <p className="text-zinc-500 text-sm md:text-base mb-8 md:mb-10 leading-relaxed font-medium">
              Permanent system erasure will occur for this transmission vector. Abort or Confirm?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="py-4 rounded-2xl bg-white/5 text-zinc-300 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all border border-white/5 active:scale-95"
              >
                Abort
              </button>
              <button
                onClick={resolveReport}
                className="py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-red-400 shadow-xl shadow-red-500/20 transition-all active:scale-95"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="glass-card border-white/10 p-8 md:p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-secondary" />
            <button onClick={() => setShowAdminModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-all scale-110 active:scale-90">
              <X size={24} />
            </button>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 md:mb-8">
              <Shield size={32} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Elevate Authority</h2>
            <p className="text-zinc-500 text-sm md:text-base mb-6 md:mb-8 leading-relaxed font-medium">Grant administrative clearance to user by system identifier.</p>
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="operator@nexus.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-5 pr-5 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all outline-none text-sm md:text-base font-bold"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-4 rounded-2xl glass font-black uppercase tracking-widest text-[10px] md:text-xs text-zinc-400 hover:text-white transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  disabled={adminLoading}
                  onClick={createAdmin}
                  className="flex-1 py-4 rounded-2xl premium-button font-black uppercase tracking-widest text-[10px] md:text-xs text-white transition-all active:scale-95"
                >
                  {adminLoading ? "Processing..." : "Authorize"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
