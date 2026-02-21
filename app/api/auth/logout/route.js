import { NextResponse } from "next/server";

export async function POST (){
    const res = NextResponse.json(
        {message : "logout successfully"},
        {status :200}
    )

    //delete cookies
    res.cookies.set("token" , "" , {maxAge :0})
    return res
}