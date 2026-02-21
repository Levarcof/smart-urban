import connectDB from "@/app/lib/db"
import User from "@/app/models/User"
import { NextResponse } from "next/server"

export async function GET() {
  await connectDB()

  const totalUsers = await User.countDocuments()
  const totalAdmins = await User.countDocuments({ role: "admin" })

  return NextResponse.json({
    totalUsers,
    totalAdmins,
  })
}
