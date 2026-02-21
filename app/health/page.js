"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FileText } from "lucide-react";

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
    const res = await fetch(
      `/api/hospitals?lat=${coords.lat}&lng=${coords.lng}&radius=${finalRadius}&type=${type}`
    );
    const data = await res.json();
    let list = data.hospitals || [];
    list.sort((a, b) => a.distance - b.distance);
    if (radius > 30) list = list.slice(0, 10);
    setHospitals(list);
    setLoading(false);
  };

  const getGoogleMapsLink = (hospital) =>
    coords
      ? `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${hospital.lat},${hospital.lng}`
      : "#";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-green-900 text-white pt-24 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl  font-extrabold tracking-tight mb-3 text-green-300 drop-shadow-lg">
            Nearby Hospitals
            </h1>
            <p className="text-gray-300 text-sm md:text-lg">
              Find hospitals near your current location instantly
            </p>
          </div>

          {/* Controls Panel */}
          <div className="md:w-[50%] md:mx-auto mb-12 flex flex-wrap md:flex-nowrap items-center justify-center gap-4 bg-green-900/10  backdrop-blur-2xl rounded-3xl px-5 py-4 shadow-2xl">

            {/* Human / Animal Buttons */}
            <button
              onClick={() => setType("human")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-2xl font-semibold text-base transition shadow-md text-center border border-green-500 ${
                type === "human"
                  ? "bg-green-500 text-black shadow-lg"
                  : "bg-transparent text-green-300 hover:bg-green-500 hover:text-black"
              }`}
            >
              Human
            </button>

            <button
              onClick={() => setType("animal")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-2xl font-semibold text-base transition shadow-md text-center border border-green-500 ${
                type === "animal"
                  ? "bg-green-500 text-black shadow-lg"
                  : "bg-transparent text-green-300 hover:bg-green-500 hover:text-black"
              }`}
            >
              Animal
            </button>

            {/* Radius Input */}
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="flex-1 md:flex-none px-4 py-2 w-full max-w-[120px]  text-sm rounded-2xl bg-black/30 text-green-200  placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-base text-center"
              placeholder="Radius(km)"
            />

            {/* Search Button */}
            <button
              onClick={fetchHospitals}
              className="flex-1 md:flex-none px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-black rounded-2xl font-semibold shadow-lg hover:from-green-600 hover:to-green-500 transition text-base"
            >
              Search
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-green-400 font-semibold mb-6 text-lg animate-pulse">
              Searching nearby hospitals...
            </div>
          )}

          {/* Hospitals Grid */}
          {hospitals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hospitals.map((h, i) => (
                <div
                  key={i}
                  className="bg-black/50 backdrop-blur-xl rounded-3xl shadow-2xl p-5 hover:scale-105 transition transform hover:shadow-3xl"
                >
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-lg mb-4">
                    <img
                      src={h.photo}
                      alt="hospital"
                      className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                    />
                    <div className="absolute bottom-0 left-0 w-full text-white bg-gradient-to-t from-black/60 to-transparent p-3  font-semibold text-sm">
                      {(h.distance / 1000).toFixed(2)} km away
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-green-300 mb-1">{h.name}</h3>
                  <p className="text-green-200 text-sm md:text-base mb-1">📍 {h.address}</p>
                  <p className="text-green-200 text-sm md:text-base mb-3">📞 {h.phone}</p>

                  <a
                    href={getGoogleMapsLink(h)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-gradient-to-r from-green-600 to-green-500 text-black py-3 rounded-2xl hover:from-green-500 hover:to-green-600 transition shadow-md font-semibold"
                  >
                    ➡️ Follow
                  </a>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="flex flex-col items-center text-center mt-16 text-green-400 space-y-3">
                <FileText size={30} className="text-green-400" />
                <p className="text-sm md:text-lg font-semibold">
                  No hospitals found in this area
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
