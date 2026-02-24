"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Navigation, AlertTriangle, CheckCircle, Search, Compass, ArrowRight, Shield, Globe, Sparkles, Activity } from "lucide-react";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(m => m.Circle), { ssr: false });

export default function Page() {
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routes, setRoutes] = useState([]);
  const [center, setCenter] = useState([26.9124, 75.7873]);
  const [allReports, setAllReports] = useState([]);
  const [safeRoute, setSafeRoute] = useState(null);
  const [currentCoord, setCurrentCoord] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);

  async function geocode(place) {
    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(place)}`);
    const data = await res.json();
    if (!data.features?.length) throw new Error("Location not found");
    const [lng, lat] = data.features[0].geometry.coordinates;
    return [lat, lng];
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported!");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentCoord([lat, lng]);
        setFrom(`Current Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        setCenter([lat, lng]);
      },
      () => alert("Location access denied!")
    );
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function countReportsOnRoute(coords, reports) {
    const radius = 2;
    let count = 0;
    for (let rep of reports) {
      const lat = rep.location?.lat;
      const lng = rep.location?.lng;
      if (!lat || !lng) continue;
      for (let [lat2, lng2] of coords) {
        if (getDistance(lat, lng, lat2, lng2) <= radius) {
          count++;
          break;
        }
      }
    }
    return count;
  }

  async function findRoutes() {
    try {
      if (!from || !to) return alert("Enter both locations");
      setLoading(true);

      let fromCoord = currentCoord ? currentCoord : await geocode(from);
      const toCoord = await geocode(to);
      setCenter(fromCoord);

      const osrmRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${fromCoord[1]},${fromCoord[0]};${toCoord[1]},${toCoord[0]}?overview=full&geometries=geojson&alternatives=true`
      );
      const osrmData = await osrmRes.json();
      if (!osrmData.routes?.length) return alert("No routes found");

      const repRes = await fetch("/api/report/all");
      const repData = await repRes.json();
      const reports = repData.reports || repData || [];
      setAllReports(reports);

      const scoredRoutes = osrmData.routes.map((route, index) => {
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        const score = countReportsOnRoute(coords, reports);
        return { id: index + 1, coords, score, distance: (route.distance / 1000).toFixed(1), duration: Math.round(route.duration / 60) };
      });

      const scores = scoredRoutes.map(r => r.score);
      const allSame = scores.every(s => s === scores[0]);
      const minScore = Math.min(...scores);

      const finalRoutes = scoredRoutes.map(r => ({
        ...r,
        color: allSame || r.score === minScore ? "#6366f1" : "#ef4444",
        isSafe: allSame || r.score === minScore
      }));

      setRoutes(finalRoutes);
      const safest = finalRoutes.find(r => r.isSafe);
      setSafeRoute(safest);
    } catch (err) {
      console.error(err);
      alert("Error fetching routes");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!safeRoute || !mapRef.current) return;
    const bounds = safeRoute.coords;
    setTimeout(() => {
      mapRef.current.invalidateSize();
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }, 500);
  }, [safeRoute]);

  function followInGoogleMaps() {
    if (!safeRoute) return alert("No safe route found!");
    const start = safeRoute.coords[0];
    const end = safeRoute.coords[safeRoute.coords.length - 1];
    const url = `https://www.google.com/maps/dir/?api=1&origin=${start[0]},${start[1]}&destination=${end[0]},${end[1]}&travelmode=driving`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <Navbar />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[100%] md:w-[70%] h-[70%] bg-accent/10 rounded-full blur-[80px] md:blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[100%] md:w-[60%] h-[60%] bg-accent-secondary/5 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-5 md:pt-32 pb-24">

        {/* HERO SECTION */}
        <section className="mb-10 md:mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-4 md:mb-6 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent-secondary">
                <Sparkles size={14} /> City Navigation
              </div>
              <h1 className="text-3xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                Safe <span className="text-gradient">Routes</span>
              </h1>
              <p className="text-zinc-500 mt-2 md:mt-4 text-sm md:text-xl font-medium">
                Advanced AI-powered pathfinding with real-time structural safety and civilian risk synthesis.
              </p>
            </div>
            <Link href="/reports" className="w-full md:w-auto">
              <button
                className="premium-button w-full md:w-auto flex items-center justify-center gap-2 group py-4 md:py-3.5"
              >
                <AlertTriangle size={20} className="group-hover:animate-bounce" /> Report Incident
              </button>
            </Link>
          </div>
        </section>

        {/* SEARCH & CONTROLS */}
        <section className="mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="glass-card p-3 md:p-3 shadow-2xl border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-4 relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-accent">
                  <Compass size={18} />
                </div>
                <input
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm md:text-base"
                  placeholder="Establish Origin"
                  value={from}
                  onChange={(e) => { setFrom(e.target.value); setCurrentCoord(null); }}
                />
              </div>
              <div className="lg:col-span-2">
                <button
                  onClick={getCurrentLocation}
                  className="w-full h-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl glass border-white/5 text-zinc-400 font-bold hover:bg-white/10 hover:text-white transition-all active:scale-95 text-sm md:text-base"
                >
                  <MapPin size={18} /> GPS Sync
                </button>
              </div>
              <div className="lg:col-span-4 relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-accent">
                  <Navigation size={18} />
                </div>
                <input
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm md:text-base"
                  placeholder="Set Destination Vector"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div className="lg:col-span-2">
                <button
                  onClick={findRoutes}
                  disabled={loading}
                  className="w-full h-full flex items-center justify-center gap-2 px-6 py-4 premium-button font-bold text-white transition-all active:scale-95 text-sm md:text-base"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                 Follow route
                </button>
              </div>
            </div>

            {safeRoute && (
              <div className="flex justify-center mt-6 md:p-2 animate-in fade-in duration-500">
                <button
                  onClick={followInGoogleMaps}
                  className="w-full md:w-auto px-10 py-4 md:py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all group active:scale-95"
                >
                  <Globe size={18} className="text-accent group-hover:rotate-12 transition-transform" /> Sync External <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* DATA GRID & MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* ROUTES FEED */}
          <section className="lg:col-span-4 space-y-4 md:space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            {routes.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-zinc-500 font-black uppercase tracking-widest text-[10px] px-2">
                  <Activity size={12} /> Synthetic Path Analysis
                </div>
                {routes.map(r => (
                  <div
                    key={r.id}
                    onClick={() => setSafeRoute(r)}
                    className={`glass-card p-5 md:p-6 border-white/5 cursor-pointer transition-all duration-500 group ${safeRoute?.id === r.id ? "border-accent/40 bg-accent/5 ring-4 ring-accent/5" : "hover:bg-white/[0.02]"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.isSafe ? "bg-accent/10 text-accent" : "bg-red-500/10 text-red-500"}`}>
                          {r.isSafe ? <Shield size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div>
                          <h3 className="text-white font-bold tracking-tight text-sm md:text-base">Vectored Path {r.id}</h3>
                          <div className="flex items-center gap-3 text-zinc-500 text-[10px] md:text-xs mt-1">
                            <span className="flex items-center gap-1 font-bold"><Globe size={12} /> {r.distance} KM</span>
                            <span className="flex items-center gap-1 font-bold"><Compass size={12} /> {r.duration} Min</span>
                          </div>
                        </div>
                      </div>
                      {r.isSafe && <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] md:text-[10px] font-black tracking-widest uppercase">OPTIMAL</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6">
                      <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                        <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Risk Factors</p>
                        <p className={`text-base md:text-lg font-bold ${r.score === 0 ? "text-emerald-400" : "text-zinc-300"}`}>{r.score} Nodes</p>
                      </div>
                      <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                        <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                        <p className={`text-base md:text-lg font-bold ${r.isSafe ? "text-accent" : "text-red-500"}`}>{r.isSafe ? "SECURE" : "UNSTABLE"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="glass-card p-10 md:p-12 text-center border-white/5 animate-pulse">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-800 mx-auto mb-6">
                  <Compass size={32} />
                </div>
                <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Waiting for Logic...</p>
              </div>
            )}
          </section>

          {/* MAP VISUALIZER */}
          <section className="lg:col-span-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="glass-card border-white/5 overflow-hidden shadow-2xl relative">
              <div className="absolute top-4 left-4 z-[100] flex gap-2">
                <div className="glass px-3 py-1.5 rounded-xl text-[8px] md:text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-time Feed
                </div>
              </div>
              <MapContainer
                center={center}
                zoom={13}
                style={{ width: "100%", height: "50vh", minHeight: "400px" }}
             ref={mapRef}
                className="z-10"
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                {routes.map((r, i) => (
                  <Polyline
                    key={i}
                    positions={r.coords}
                    pathOptions={{
                      color: r.isSafe ? "#6366f1" : "#ef4444",
                      weight: r.isSafe ? 6 : 4,
                      opacity: safeRoute?.id === r.id ? 1 : 0.3,
                      dashArray: r.isSafe ? "" : "10, 10"
                    }}
                  />
                ))}

                {allReports.map((rep, i) => (
                  <Marker key={i} position={[rep.location.lat, rep.location.lng]}>
                    <Popup className="glass-popup">
                      <div className="p-1">
                        <h4 className="font-bold text-white mb-1">⚠️ System Alert</h4>
                        <p className="text-zinc-400 text-xs">{rep.message}</p>
                        <div className="mt-2 text-[10px] font-bold text-accent uppercase tracking-widest">Operator: {rep.name}</div>
                      </div>
                    </Popup>
                    <Circle
                      center={[rep.location.lat, rep.location.lng]}
                      radius={1500}
                      pathOptions={{ color: "#6366f1", fillOpacity: 0.1, weight: 1 }}
                    />
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 px-2">
              <div className="flex items-center gap-2"><div className="w-3 h-1 bg-accent rounded-full" /> Optimized Trajectory</div>
              <div className="flex items-center gap-2"><div className="w-3 h-1 bg-red-500 rounded-full" /> Risk Interference</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent/20 border border-accent/40" /> Signal Area</div>
            </div>
          </section>

        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #0a0a0b !important;
        }
        .glass-popup .leaflet-popup-content-wrapper {
          background: rgba(20, 20, 22, 0.8) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          padding: 8px;
        }
        .glass-popup .leaflet-popup-tip {
          background: rgba(20, 20, 22, 0.8) !important;
        }
      `}</style>
    </div>
  );
}

const Loader2 = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
