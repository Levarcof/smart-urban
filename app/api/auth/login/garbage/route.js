import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import GarbageDepartment from "@/app/models/GarbageDepartment";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        // ✅ Validation
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // ✅ Find department by email
        const department = await GarbageDepartment.findOne({ email });
        if (!department) {
            return NextResponse.json(
                { message: "No department found with this email" },
                { status: 404 }
            );
        }

        // ✅ Check password
        const isMatch = await bcrypt.compare(password, department.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: department._id , role: "department"  },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Login success — return department info + set cookie
        const res = NextResponse.json(
            {
                message: "Department login successful",
                user: {
                    id: department._id,
                    name: department.name,
                    email: department.email,
                    image : department.image,
                    address: department.address,
                    location: department.location,
                },
            },
            { status: 200 }
        );

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        
        return res;
    }
    catch (error) {
        console.error("❌ Department Login Error:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
