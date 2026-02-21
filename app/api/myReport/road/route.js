import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import { Report } from "@/app/models/reportModel";
export async function POST(req){
    try{
        const {email} = await req.json()
        if(!email){
           return NextResponse.json(
            {message : "Email is requred"},
            {status : 400}
        ) 
        }
        await connectDB()

        const reports = await Report.find({email})
        if(!reports.length){
            return NextResponse.json(
            {message : "No any report find"},
            {status : 404}
        ) 
        }
return NextResponse.json(
  {
    message: "Reports fetched successfully",
    reports
  },
  { status: 200 }
)


    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {status : 500}
        )
    }
}