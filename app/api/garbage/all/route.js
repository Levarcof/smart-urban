import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import { GarbageReport } from "@/app/models/garbadgeReport";


export async function GET(){
    try{
        await connectDB()
        const reports = await GarbageReport.find({})
        return NextResponse.json(
            {message : "succesfully fetched reports",
                reports
            },
            {status : 200}
        )


    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {message : "internal error"},
            {status : 500}
        )
    }
}