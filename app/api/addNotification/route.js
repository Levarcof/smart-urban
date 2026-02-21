import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import { Notification } from "@/app/models/notificationInfo";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, image, departmentName } = body;

    // Validation
    if (!email || !image || !departmentName) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to DB
    const newNotification = await Notification.create({
      email,
      image,
      departmentName,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Notification stored successfully",
        data: newNotification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Notification Save Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}