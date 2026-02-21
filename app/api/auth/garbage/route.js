import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import GarbageDepartment from "@/app/models/GarbageDepartment";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("📥 Request Body:", body);

    const { departmentName, email, password, address, location, image } = body;


    // ✅ Validation
    if (
      !departmentName ||
      !email ||
      !password ||
      !address ||
      !location?.lat ||
      !location?.lng  ||
      !image
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const lat = Number(location.lat);
    const lng = Number(location.lng);

    // ✅ Validate lat/lng
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { message: "Invalid latitude or longitude" },
        { status: 400 }
      );
    }

    // ✅ Check duplicate email
    const existing = await GarbageDepartment.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Department already registered with this email" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create department (MATCHING SCHEMA)
    const department = await GarbageDepartment.create({
      name: departmentName,
      email,
      password: hashedPassword,
      address,
      image,
      location: {
        lat,
        lng,
      },
    });

    return NextResponse.json(
      {
        message: "✅ Garbage Department registered successfully",
        department: {
          id: department._id,
          name: department.name,
          email: department.email,
          address: department.address,
          location: department.location,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Garbage Department Register Error:", error);

    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
