import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import { Report } from "@/app/models/reportModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import GarbageDepartment from "@/app/models/GarbageDepartment";
import { GarbageReport } from "@/app/models/garbadgeReport";

export async function PUT(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, image, location, address } = body;
        const cookieStore = await cookies();   // ✅ await added
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const id = decoded.id; // ✅ token se id
        const role = decoded.role;

        let updatedUser;

        // =======================
        // ✅ DEPARTMENT UPDATE
        // =======================
        if (role === "department") {
            updatedUser = await GarbageDepartment.findByIdAndUpdate(
                id,
                {
                    ...(name && { name }),
                    ...(image && { image }),
                    ...(address && { address }),
                    ...(location && { location }),
                },
                { new: true }
            );

            const email = updatedUser.email

           const updateReports = await GarbageReport.updateMany({"departments.0.email" : email} ,
            {$set :{ "departments.0.departmentName" : name ,
            "departments.0.address" : address,
            "departments.0.location" : location ,
           }
         }
            
           ) 

            if (!updatedUser) {
                return NextResponse.json(
                    { success: false, message: "Department not found" },
                    { status: 404 }
                );
            }
        }
        else {
            updatedUser = await User.findByIdAndUpdate(
                id,
                {
                    ...(name && { name }),
                    ...(image && { image }),
                },
                { new: true }
            );

            if (!updatedUser) {
                return NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            const email = updatedUser.email;

            if (name) {
                await Report.updateMany({ email }, { $set: { name } });
                await GarbageReport.updateMany({ email }, { $set: { name } });
            }
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("🔥 UPDATE ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
