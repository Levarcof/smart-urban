import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import { GarbageReport } from "@/app/models/garbadgeReport";
import jwt, { decode } from "jsonwebtoken"
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const { email } = await req.json()
        if (!email) {
            return NextResponse.json(
                { message: "Email is requred" },
                { status: 400 }
            )
        }

        const cookieStore = await cookies();   // ✅ await added
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await connectDB()
        let reports = null
        if(decoded.role == "department"){
            reports = await GarbageReport.find({"departments.0.email" : email})
        }
        else{
          reports = await GarbageReport.find({ email })  
        }
        if (!reports || !reports.length) {
            return NextResponse.json(
                { message: "No any report find", },
                { status: 404 }
            )
        }
        return NextResponse.json(
            {
                message: "Reports fetched successfully",
                success : true,
                reports
            },
            { status: 200 }
        )


    }
    catch (error) {
        console.log(error)
        return NextResponse.json(
            { status: 500 }
        )
    }
}