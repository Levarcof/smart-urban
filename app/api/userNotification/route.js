import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import { Notification } from "@/app/models/notificationInfo";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // 🔥 Fetch notifications for logged in user
    const notifications = await Notification.find({ email })
      .sort({ createdAt: -1 }); // latest first

    return NextResponse.json(
      {
        success: true,
        count: notifications.length,
        notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notification Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}