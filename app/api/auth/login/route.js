import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { email, password  } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        }
        await connectDB()
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Password not matched" },
                { status: 400 }
            )

        }
        const token = jwt.sign(
            { id: user._id , role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const res = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image : user.image,
                    role : user.role
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
        console.log(error);
        return NextResponse.json(
            { message: "Server error!" },
            { status: 500 }
        );


    }

}