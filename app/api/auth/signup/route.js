import  connectDb  from "@/app/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"


export async function POST(req) {
    try {
        const { name, email, password , image } = await req.json()
        if (!name || !email || !password || !image) {
            return NextResponse.json(
                { message: "All fields are require to fill" },
                { status: 400 }
            )
        }

        await connectDb()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exist" },
                { status: 400 }
            )
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            image,
            password: hashPassword,
            role : 'user'
        })

        return NextResponse.json(
            { message: "user created successfully", user: newUser },
            { status: 201 }
        )
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server error!" },
            { status: 500 }
        );
    } 

}