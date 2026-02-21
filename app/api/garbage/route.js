import connectDB from "@/app/lib/db";
import { GarbageReport } from "@/app/models/garbadgeReport";
import GarbageDepartment from "@/app/models/GarbageDepartment";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, message, address, location, images } = body;

    if (!name || !email || !address || !location || !location.lat || !location.lng) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    let m = message || "Garbage problem";

    // Function to calculate distance between two coordinates (in meters)
    const haversineDistance = (lat1, lng1, lat2, lng2) => {
      const toRad = (deg) => (deg * Math.PI) / 180;
      const R = 6371 * 1000; // Earth radius in meters
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Step 1: Check if there is an existing report within 50 meters
    const existingReports = await GarbageReport.find({});
    for (let report of existingReports) {
      const distance = haversineDistance(
        location.lat,
        location.lng,
        report.location.lat,
        report.location.lng
      );
      if (distance <= 50) {
        // If found, increment the count and return the updated report
        report.count = (report.count || 1) + 1;
        await report.save();
        return NextResponse.json(
          { success: true, report, message: "Existing report count updated" },
          { status: 200 }
        );
      }
    }

    // Step 2: If no nearby report, find nearest department
    const departments = await GarbageDepartment.find({});

    const departmentsWithDistance = departments.map((dep) => ({
      departmentName: dep.name,
      address: dep.address,
      email: dep.email,
      location: dep.location,
      distance: haversineDistance(
        location.lat,
        location.lng,
        dep.location.lat,
        dep.location.lng
      ),
    }));

    departmentsWithDistance.sort((a, b) => a.distance - b.distance);
    const nearestDepartments = departmentsWithDistance.slice(0, 1);

    // Step 3: Create new report
    const newReport = await GarbageReport.create({
      name,
      email,
      message: m,
      address,
      location,
      images,
      count: 1, // initial count
      departments: nearestDepartments.map((dep) => ({
        departmentName: dep.departmentName,
        address: dep.address,
        email: dep.email,
        location: dep.location,
      })),
    });

    return NextResponse.json(
      { success: true, report: newReport, message: "New report created" },
      { status: 200 }
    );
  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}