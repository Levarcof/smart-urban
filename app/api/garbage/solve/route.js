import connectDB from "@/app/lib/db";
import { NextResponse } from "next/server";
import { GarbageReport } from "@/app/models/garbadgeReport";

export async function POST (req){
    try{
        const {id , email} = await req.json()
        if(!id ){
             return NextResponse.json(
            {message : "report not found"},
            {status :400}
        )

        }
        await connectDB()
        const report = await GarbageReport.findByIdAndDelete(id)
        const allReports = await GarbageReport.find({email})
        
        return NextResponse.json(
            {message : "remove successfyllt",
                success : true,
                allReports

            },
            {status :200}
        )
    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {message : "Internal error"},
            {status :500}
        )
    }
}