// app/api/userNotification/delete/route.js
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import { Notification } from "@/app/models/notificationInfo"; // Make sure this path is correct

export const runtime = "nodejs"; // optional, ensures server runtime

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Notification ID is required" },
        { status: 400 }
      );
    }

    await connectDB(); // connect to MongoDB

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete notification" },
      { status: 500 }
    );
  }
}