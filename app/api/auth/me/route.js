import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import jwt from "jsonwebtoken"
import User from "@/app/models/User";
import GarbageDepartment from "@/app/models/GarbageDepartment";
import { cookies } from "next/headers";

export async function GET() {
    try {
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
        let user  = null
        if(decoded.role == "department"){
            user = await GarbageDepartment.findById(decoded.id).select("-password")
        }
        else{
            user =await User.findById(decoded.id).select("-password")
        }
        return NextResponse.json(
            { user },
            { status: 200 }
        )

    }
    catch (error) {
        console.error("Me API Error:", error);
        return NextResponse.json(
            { message: "Invalid token" },
            { status: 401 }
        );

    }
}