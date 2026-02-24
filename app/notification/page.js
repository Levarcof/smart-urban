"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Bell, XCircle, Clock, Trash2, Sparkles, Activity, Shield, Zap, ArrowRight, Info, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

export default function NotificationPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const fetchNotifications = async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/userNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      if (data.success) {
        setNotifications(data.notifications || []);
      } else {
        setError(data.message || "Failed to establish telemetry uplink.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Critical signal failure. Retry uplink.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/userNotification/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      } else {
        alert(data.message || "Archive protocol failed.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Encryption error during data purge.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <Navbar />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[100%] md:w-[50%] h-[50%] bg-accent/10 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[100%] md:w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-5 md:pt-32 pb-24">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="space-y-4 text-center md:text-left">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent-secondary">
              <Sparkles size={14} /> Neural Feed Active
            </div> */}
            <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase italic">
              Notifi<span className="text-gradient">cation</span>
            </h1>
            {/* <p className="text-zinc-500 text-sm md:text-lg font-medium max-w-xl mx-auto md:mx-0">
              Real-time intelligence and protocol updates from regional Nexus nodes.
            </p> */}
          </div>

          {/* <div className="flex items-center justify-center gap-6 glass p-4 rounded-2xl border-white/10">
            <div className="flex flex-col items-end">
              <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">Feed Integrity</p>
              <p className="text-white font-black text-xs md:text-sm tracking-tight">99.9% Nominal</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <Activity size={20} className="animate-pulse" />
            </div>
          </div> */}
        </div>

        {/* Status Indicators */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 md:py-32 space-y-6">
            <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-accent animate-spin" />
            <p className="text-zinc-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] animate-pulse">Establishing Nexus Link...</p>
          </div>
        )}

        {error && (
          <div className="glass-card border-red-500/20 p-8 md:p-12 text-center max-w-2xl mx-auto active:scale-95 transition-all">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
              <Zap size={32} />
            </div>
            <p className="text-red-400 font-bold mb-4 text-sm md:text-base">{error}</p>
            <button onClick={fetchNotifications} className="w-full md:w-auto px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              Retry Sync
            </button>
          </div>
        )}

        {!loading && notifications.length === 0 && !error && (
          <div className="glass-card border-white/5 py-24 md:py-32 text-center animate-in fade-in zoom-in duration-700">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl glass border-white/10 flex items-center justify-center text-zinc-700 mx-auto mb-6 md:mb-8 shadow-inner">
              <Bell size={40} className="md:size-10" />
            </div>
            <p className="text-xl md:text-2xl font-black text-white mb-2 uppercase italic">The Grid is Silent</p>
            <p className="text-zinc-500 text-sm md:text-base font-medium max-w-md mx-auto px-4">All operational parameters are within nominal ranges. No disrupting signals detected.</p>
          </div>
        )}

        {/* Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {notifications.map((n, i) => (
            <div
              key={n._id}
              className="glass-card p-6 md:p-8 border-white/5 hover:border-accent/40 transition-all duration-700 group relative flex flex-col justify-between animate-in fade-in slide-in-from-bottom-8 active:scale-[0.98]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] -z-10 group-hover:bg-accent/10 transition-colors" />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 text-accent font-black text-[9px] uppercase tracking-widest border border-accent/20">
                    {n.departmentName}
                  </div>
                  <div className="text-zinc-600">
                    <Shield size={18} />
                  </div>
                </div>

                <p className="text-white font-bold text-base md:text-lg mb-4 leading-snug group-hover:text-accent-secondary transition-colors italic tracking-tight">
                  {n.message || "Operational directive received."}
                </p>
              </div>

              {n.image && (
                <div className="mb-4 md:mb-6 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative aspect-[16/9] group-hover:border-accent/20 transition-all">
                  <img
                    src={n.image}
                    alt="Intelligence"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              )}

              <div className="flex justify-between items-center mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-zinc-500">
                  <Clock size={14} />
                  {clientReady ? (
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest font-mono">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  ) : (
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest font-mono">Syncing...</p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(n._id)}
                  className="px-5 md:px-6 py-2 rounded-xl glass border-white/10 text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95 flex items-center gap-2"
                >
                  Discard <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 md:mt-24 flex items-center justify-center gap-3 text-zinc-700 animate-in fade-in duration-1000 delay-1000">
          <Info size={14} />
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center px-4 leading-relaxed">
            Feed history is automatically archived after established protocol durations.
          </p>
        </div>

      </div>
    </div>
  );
}
