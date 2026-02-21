import connectDB from "@/app/lib/db"
import { Report } from "@/app/models/reportModel"
import { NextResponse } from "next/server"



export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, email, message, address, location } = body

    if(!name || !email || !message || !address || !location){
        return NextResponse.json(
            {message :"All fields are requre"},
            {status :400}
        )
    }
    const report = await Report.create({
      name,
      email,
      message,
      address,
      location,
    })

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.log("Report error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
