"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FileText, MapPin, Search, Navigation, Phone, Heart, Activity, Info, Sparkles, Loader2 } from "lucide-react";

export default function HealthPage() {
  const [type, setType] = useState("human");
  const [radius, setRadius] = useState(5);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Please allow location access!")
    );
  }, []);

  const fetchHospitals = async () => {
    if (!coords) return alert("Location not found!");
    setLoading(true);

    const finalRadius = radius > 30 ? 30000 : radius * 1000;
    try {
      const res = await fetch(
        `/api/hospitals?lat=${coords.lat}&lng=${coords.lng}&radius=${finalRadius}&type=${type}`
      );
      const data = await res.json();
      let list = data.hospitals || [];
      list.sort((a, b) => a.distance - b.distance);
      if (radius > 30) list = list.slice(0, 10);
      setHospitals(list);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getGoogleMapsLink = (hospital) =>
    coords
      ? `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${hospital.lat},${hospital.lng}`
      : "#";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground pt-5 md:pt-32 pb-24 md:pb-20 font-sans relative overflow-hidden">

        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[100%] md:w-[60%] h-[60%] bg-accent/10 rounded-full blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[100%] md:w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[80px] md:blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center mb-4 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-4 md:mb-6">
              <Sparkles size={14} className="text-accent" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-accent-secondary">Emergency Locator</span>
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tight">
              Pulse Health <span className="text-gradient">Search</span>
            </h1>
            <p className=" hidden md:block text-zinc-500 text-sm md:text-lg max-w-2xl mx-auto font-medium">
              Synchronizing with regional medical nodes to identify peak critical care availability.
            </p>
          </div>

          {/* Controls Panel */}
          <div className="max-w-4xl mx-auto glass-card p-3 md:p-3 mb-10 md:mb-20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex bg-black/20 p-1 rounded-2xl w-full md:w-auto">
                <button
                  onClick={() => setType("human")}
                  className={`flex-1 md:flex-none px-6 md:px-8 py-3.5 md:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-sm transition-all duration-500 flex items-center justify-center gap-2 ${type === "human"
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-zinc-500 hover:text-white"
                    }`}
                >
                  <Activity size={18} /> Human
                </button>
                <button
                  onClick={() => setType("animal")}
                  className={`flex-1 md:flex-none px-6 md:px-8 py-3.5 md:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-sm transition-all duration-500 flex items-center justify-center gap-2 ${type === "animal"
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-zinc-500 hover:text-white"
                    }`}
                >
                  <Heart size={18} /> Animal
                </button>
              </div>

              <div className="relative flex-1 group w-full">
                <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-accent transition-colors" />
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-sm font-bold"
                  placeholder="Scan Radius (KM)"
                />
              </div>

              <button
                onClick={fetchHospitals}
                disabled={loading}
                className="w-full md:w-auto px-10 py-4 premium-button flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] md:text-sm"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={20} />}
                Initiate Scan
              </button>
            </div>
          </div>

          {/* Loading Atmosphere */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-accent/10 border-t-accent animate-spin mb-6" />
              <p className="text-accent font-black uppercase tracking-[0.3em] text-[10px] md:text-sm">Decoding Signal Nodes...</p>
            </div>
          )}

          {/* Hospitals Results */}
          {hospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              {hospitals.map((h, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col glass-card border-white/5 overflow-hidden hover-glow transition-all duration-500 active:scale-[0.98]"
                >
                  <div className="relative w-full h-56 md:h-64 overflow-hidden">
                    <img
                      src={h.photo}
                      alt="h-node"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 right-4 px-4 py-1.5 glass rounded-full text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                      {(h.distance / 1000).toFixed(2)} KM Range
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-accent transition-colors truncate">{h.name}</h3>
                    <div className="flex items-start gap-2 text-zinc-400 mb-3">
                      <MapPin size={16} className="text-accent shrink-0 mt-1" />
                      <span className="text-xs md:text-sm font-bold leading-relaxed line-clamp-2">{h.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 mb-6 md:mb-8">
                      <Phone size={14} className="text-accent-secondary" />
                      <span className="text-[11px] md:text-xs font-black tracking-widest tabular-nums uppercase">{h.phone || "No Identifier"}</span>
                    </div>

                    <a
                      href={getGoogleMapsLink(h)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="premium-button w-full flex items-center justify-center gap-2 group/btn font-black uppercase tracking-widest text-[10px] md:text-xs py-4"
                    >
                      Establish Link <Navigation size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && hospitals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-8 glass border-white/5 rounded-[2rem] animate-in fade-in duration-700 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-700 mb-6">
                  <Info size={32} />
                </div>
                <h3 className="text-lg md:text-2xl font-black text-zinc-500 uppercase tracking-widest mb-2">Null Sector</h3>
                <p className="text-zinc-600 text-sm font-bold max-w-sm">No medical nodes identified within specified radius. Adjust scan vector and retry.</p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
