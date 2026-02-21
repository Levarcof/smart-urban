import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(req) {
    try {
        const { email } = await req.json()
        if (!email) {
            return NextResponse.json(
                { message: "email not found" },
                { status: 400 }
            )
        }
        await connectDB()

        const user = await User.findOneAndUpdate({ email })
        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 400 }
            )
        }
        user.role = 'admin'
        await user.save()
        return NextResponse.json(
            {
                message: "Create admin successfully",
                success: true
            },
            { status: 200 }
        )
    }
    catch (error) {
        console.log(error)
        return NextResponse.json(
            {message : "internal error"},
            {status : 500}
        )

    }
}