import { NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import { Report } from "@/app/models/reportModel"

export async function GET() {
  await connectDB()

  const reports = await Report.find({})

  return NextResponse.json({ reports })
}
