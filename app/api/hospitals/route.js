import { NextResponse } from "next/server";

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || 5000;
    const type = searchParams.get("type") || "human";

    const apiKey = process.env.GEOAPIFY_KEY;
    console.log("api key : ",apiKey)

    if (!lat || !lng) {
      return NextResponse.json({ error: "Location missing" }, { status: 400 });
    }
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);


    let categories =
      type === "animal"
        ? "pet.veterinary"
        : "healthcare.hospital";


    
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lngNum},${latNum},${radius}&limit=50&apiKey=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    const hospitals = (data.features || []).map((place) => {
      const p = place.properties;
      const distance = getDistance(parseFloat(lat), parseFloat(lng), p.lat, p.lon);

      return {
        name: p.name || "Unknown Hospital",
        address: p.formatted || "Address not available",
        phone: p.datasource?.raw?.phone || p.contact?.phone || "Not available",
        lat: p.lat,
        lng: p.lon,
        distance,
        photo: "/hospital.png",
      };
    });

    // Closest first
    hospitals.sort((a, b) => a.distance - b.distance);

    return NextResponse.json({ hospitals });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ hospitals: [], error: "Server error" }, { status: 500 });
  }
}
