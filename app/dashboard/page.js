"use client"
import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { LayoutDashboard, Search, X, Trash2, Image as ImageIcon } from "lucide-react"

export default function Page() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [send , setSend] = useState(false)
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
    // if (activeTab === "medical") return "/api/medical/all"
  }

  const getDeleteApi = () => {
    if (activeTab === "routes") return "/api/report/solve"
    if (activeTab === "garbage") return "/api/garbage/solve"
    // if (activeTab === "medical") return "/api/medical/solve"
  }

  const fetchReports = async () => {
    const res = await fetch(getApiUrl())
    const data = await res.json()
    setReports(data.reports || [])
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

  // ✅ OPEN DELETE MODAL
  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }

  // ✅ REAL DELETE LOGIC (same API)
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

      <div className="min-h-screen p-22 w-full text-white bg-[#020617]">

        {/* TOP BAR */}
        <div className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10 px-3 sm:px-8 py-2 flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">

          <div className="flex items-center gap-2 flex-wrap">
            <LayoutDashboard size={20} className="text-green-400" />

            <div className="flex gap-1 bg-white/5 rounded-lg border border-white/10 px-1 py-1 overflow-x-auto">
              {[
                { key: "routes", label: "Routes" },
                { key: "garbage", label: "Garbage" },
                // { key: "medical", label: "Medical" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1 text-xs rounded-md transition whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-green-500 text-black"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[280px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <button
              onClick={() => setShowAdminModal(true)}
              className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-green-500 text-black font-semibold whitespace-nowrap"
            >
              + Admin
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 px-3 sm:px-8 mt-5 flex-wrap">
          {["all", "today", "month"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-green-500 text-black shadow-lg"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {f === "all" ? "All Reports" : f === "today" ? "Today" : "Last 30 Days"}
            </button>
          ))}
        </div>

        {/* ✅ STATS (MOBILE 2 BOX PER ROW) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-3 sm:px-8 py-5">
          {[
            { label: "Active Reports", value: reports.length },
            { label: "Total Reports", value: reports.length },
            { label: "Total Users", value: stats.totalUsers },
            { label: "Admins", value: stats.totalAdmins },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-4 bg-black/70 border border-white/10 backdrop-blur-xl shadow-lg"
            >
              <p className="text-gray-400 text-xs">{item.label}</p>
              <h2 className="text-2xl sm:text-3xl font-black text-green-400 mt-1">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block mx-3 sm:mx-8 mb-12 rounded-xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-xl overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                {activeTab === "garbage" && <th className="px-6 py-2 text-left">Image</th>}
                <th className="px-6 py-2 text-left">Location</th>
              {activeTab === "garbage" &&  <th className="px-6 py-2 text-left">Send to</th>}
          

              
                <th className="px-6 py-2 text-left">Type</th>
                <th className="px-6 py-2 text-left">Date</th>
                <th className="px-6 py-2 text-left">User</th>
                <th className="px-6 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((r) => (
                <tr key={r._id} className="border-t border-white/5 hover:bg-green-500/5 transition">
                  {activeTab === "garbage" && (
                    <td className="px-6 py-2">
                      {r.images ? (
                        <img
                          src={r.images[0]}
                          className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                          onClick={() => setPreviewImage(r.images[0])}
                        />
                      ) : (
                        <ImageIcon size={16} className="text-gray-500" />
                      )}
                    </td>
                  )}
                  <td className="px-6 py-2">{r.address}</td>

                  {activeTab === "garbage" && r.departments && (
                    <td className="px-6 py-2">
                     {r.departments[0].departmentName}
                    </td>
                  )}
                  <td className="px-6 py-2 text-gray-300">{r.message}</td>
                  <td className="px-6 py-2 text-gray-500 text-xs">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-2 text-green-400 font-semibold">
                    {r?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-2 text-right">
                    <button
                      onClick={() => openDeleteModal(r._id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden px-3 pb-12 space-y-5">
          {filteredReports.map((r) => (
            <div key={r._id} className="rounded-2xl bg-black/80 border border-white/10 p-4 shadow-xl">

              {activeTab === "garbage" && r.images && (
                <img
                  src={r.images[0]}
                  className="w-full h-44 rounded-xl object-cover cursor-pointer mb-3"
                  onClick={() => setPreviewImage(r.images[0])}
                />
              )}

              <p className="text-sm font-medium">{r.address}</p>
               {activeTab === "garbage" && r.departments && 
                    <div className="rounded-2xl bg-black/80 border text-gray-300 border-white/10 py-1 shadow-sm">Send to :- {r.departments[0].departmentName}</div>
                     
                  }

              <p className="text-xs text-gray-400 mt-1">{r.message}</p>

              <div className="flex justify-between mt-3 text-xs">
                <p className="text-green-400 font-semibold">{r?.name || "Unknown"}</p>
                <p className="text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
              </div>

              <button
                onClick={() => openDeleteModal(r._id)}
                className="mt-3 w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition"
              >
                Resolve & Delete
              </button>
            </div>
          ))}
        </div>
      </div>

   {/* IMAGE PREVIEW */}
{previewImage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
      
      {/* CLOSE BUTTON */}
      <button
        onClick={() => setPreviewImage(null)}
        className="absolute top-2 right-2 bg-black/60 p-2 rounded-full hover:bg-red-500 transition z-50"
      >
        <X size={15} />
      </button>

      {/* FULL SIZE IMAGE */}
      <img width={450} height={450}
        src={previewImage}
        className="max-w-full max-h-full rounded-xl border border-white/20 object-contain"
      />
    </div>
  </div>
)}


      {/* ✅ DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-black/80 border border-white/10 rounded-xl p-5 w-[90%] max-w-xs shadow-xl text-center">
            <h3 className="text-green-400 font-semibold text-lg">Problem Resolved?</h3>
            <p className="text-gray-400 text-xs mt-2">
              Are you sure you want to delete this report?
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="flex-1 py-2 rounded-lg bg-white/10 text-sm text-white hover:bg-white/20"
              >
                Cancel
              </button>

              <button
                onClick={resolveReport}
                className="flex-1 py-2 rounded-lg bg-green-500 text-black font-semibold text-sm hover:bg-green-400"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}
       {/* ADMIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-sm bg-black/80 border border-white/10 rounded-xl p-6 shadow-xl">
            <button onClick={() => setShowAdminModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white transition">
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-green-400 mb-4">
              Promote User to Admin
            </h2>

            <input
              type="email"
              placeholder="Enter user email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />

            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAdminModal(false)} className="flex-1 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20">
                Cancel
              </button>

              <button disabled={adminLoading} onClick={createAdmin} className="flex-1 py-2 rounded-lg bg-green-500 text-black font-semibold text-sm hover:bg-green-400">
                {adminLoading ? "Processing..." : "Make Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
