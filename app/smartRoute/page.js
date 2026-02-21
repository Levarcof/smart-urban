"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        setFrom(`Current Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
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
        return { id: index + 1, coords, score };
      });

      const scores = scoredRoutes.map(r => r.score);
      const allSame = scores.every(s => s === scores[0]);
      const minScore = Math.min(...scores);

      const finalRoutes = scoredRoutes.map(r => ({
        ...r,
        color: allSame || r.score === minScore ? "green" : "red",
      }));

      setRoutes(finalRoutes);
      const safest = finalRoutes.find(r => r.color === "green");
      setSafeRoute(safest);
    } catch (err) {
      console.error(err);
      alert("Error fetching routes");
    }
  }

  useEffect(() => {
    if (!safeRoute || !mapRef.current) return;
    const bounds = safeRoute.coords;
    setTimeout(() => {
      mapRef.current.invalidateSize();
      mapRef.current.fitBounds(bounds, { padding: [80, 80] });
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
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-green-950 to-green-900 text-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl  mx-auto px-6 pt-22 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Smart Safe Route
            </h1>
            <p className="text-white/60 mt-2 text-sm md:text-lg">
              Apple-level UI for AI-powered smart city navigation
            </p>
          </div>
          <Link href="/reports">
            <button
              onClick={() => router.push("/report")}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 text-black font-semibold shadow-xl hover:scale-105 transition"
            >
              🚨 Report Issue
            </button>
          </Link>
        </div>
      </section>

      {/* SEARCH GLASS PANEL */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="From location"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setCurrentCoord(null); }}
            />
            <button
              onClick={getCurrentLocation}
              className="bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition"
            >
              📍 Current Location
            </button>
            <input
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="To location"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <button
              onClick={findRoutes}
              className="bg-gradient-to-r from-green-400 to-emerald-600 text-black font-bold rounded-xl px-4 py-3 hover:opacity-90 transition"
            >
              Find Safe Routes
            </button>
          </div>

          {safeRoute && (
            <div className="flex justify-center mt-6">
              <button
                onClick={followInGoogleMaps}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold shadow-xl hover:scale-105 transition"
              >
                🗺️ Follow Safest Route
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ROUTES */}
      <section className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map(r => (
          <div
            key={r.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
          >
            <h3 className="text-lg font-semibold">Route #{r.id}</h3>
            <p className="text-sm text-white/60 mt-1">
              Reports Nearby:{" "}
              <span className={r.color === "green" ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                {r.score}
              </span>
            </p>
            <span className={`inline-block mt-3 px-3 py-1 text-xs font-bold rounded-full ${r.color === "green" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {r.color === "green" ? "SAFE" : "RISKY"}
            </span>
          </div>
        ))}
      </section>

      {/* MAP */}
      <section className="max-w-7xl mx-auto px-6 mt-12 pb-16">
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <MapContainer
            center={center}
            zoom={10}
            style={{ width: "100%", height: "65vh" }}
            whenCreated={(map) => (mapRef.current = map)}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {routes.map((r, i) => (
              <Polyline
                key={i}
                positions={r.coords}
                pathOptions={{ color: r.color, weight: r.color === "green" ? 6 : 3, opacity: 0.9 }}
              />
            ))}

            {allReports.map((rep, i) => (
              <Marker key={i} position={[rep.location.lat, rep.location.lng]}>
                <Popup>
                  🚨 {rep.message} <br />
                  👤 {rep.name}
                </Popup>
                <Circle
                  center={[rep.location.lat, rep.location.lng]}
                  radius={2000}
                  pathOptions={{ color: "green", fillOpacity: 0.15 }}
                />
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
