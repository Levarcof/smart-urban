"use client"

import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import Navbar from "../components/Navbar"

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

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await res.json()
      setAddress(data.display_name)
    })
  }, [])

  // 🚨 Submit Report
  const submitReport = async () => {
    let finalMessage = selectedIssue

    if (!finalMessage) return alert("Please select an issue ❗")

    if (selectedIssue === "Other" && !customMessage.trim()) {
      return alert("Please write your message ❗")
    }

    if (selectedIssue === "Other") {
      finalMessage = customMessage
    }

    setLoading(true)

    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user?.name || "Guest",
        email: user?.email || "No Email",
        message: finalMessage,
        address,
        location,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      alert("Report submitted ✅")
      setSelectedIssue("")
      setCustomMessage("")
    } else {
      alert("Error ❌")
    }
  }

  return (
    <>
      <Navbar />

      {/* ===== PAGE WRAPPER ===== */}
      <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1b2d] to-[#020617] text-white px-4 py-12">

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          {/* ================= LEFT INFO PANEL ================= */}
          <div className="space-y-8">

            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Smart City <br />
                <span className="text-emerald-400">Issue Reporting Portal</span>
              </h1>
              <p className="text-gray-400 mt-4 max-w-xl">
                Official platform to report city issues like traffic, accidents,
                road damage, and infrastructure problems.
              </p>
            </div>

            {/* USER CARD */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl max-w-md">

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl font-bold text-emerald-400">
                  {user?.name?.[0] || "G"}
                </div>

                <div>
                  <p className="text-lg font-semibold">{user?.name || "Guest User"}</p>
                  <p className="text-sm text-gray-400">{user?.email || "No email"}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                📍 {address || "Detecting your location..."}
              </div>
            </div>

          </div>

          {/* ================= RIGHT FORM PANEL ================= */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative">

            <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-xl opacity-40"></div>

            <div className="relative z-10">

              <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
                Submit City Issue
              </h2>

              {/* ISSUE OPTIONS */}
              <div className="space-y-3 mb-6">

                {[
                  { label: "🚦 Traffic Jam", value: "Traffic Jam" },
                  { label: "💥 Accident", value: "Accident" },
                  { label: "🛣️ Road Damage", value: "Road Damage" },
                  { label: "🗑️ Garbage Problem", value: "Garbage Problem" },
                  { label: "💧 Water Leakage", value: "Water Leakage" },
                  { label: "📝 Other Issue", value: "Other" },
                ].map((issue, i) => (
                  <label
                    key={i}
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border
                    ${
                      selectedIssue === issue.value
                        ? "bg-emerald-500/10 border-emerald-500/40 shadow-lg scale-[1.01]"
                        : "bg-white/5 border-white/10 hover:border-emerald-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="issue"
                        value={issue.value}
                        checked={selectedIssue === issue.value}
                        onChange={(e) => setSelectedIssue(e.target.value)}
                        className="accent-emerald-500 w-4 h-4"
                      />
                      <span className="font-medium text-gray-200">
                        {issue.label}
                      </span>
                    </div>

                    {selectedIssue === issue.value && (
                      <span className="text-xs text-emerald-400">
                        Selected
                      </span>
                    )}
                  </label>
                ))}
              </div>

              {/* CUSTOM MESSAGE */}
              {selectedIssue === "Other" && (
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition mb-6"
                />
              )}

              {/* SUBMIT BUTTON */}
              <button
                onClick={submitReport}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-xl hover:scale-[1.02] hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Your report helps improve city infrastructure and safety.
              </p>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
