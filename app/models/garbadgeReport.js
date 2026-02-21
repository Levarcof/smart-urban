import mongoose from "mongoose";

const garbage = new mongoose.Schema(
    {
        name: String,
        email: String,
        message: String,
        address: String,
        location: {
            lat: Number,
            lng: Number,
        },
        images: {
            type: [String],
            require: true,
            default: []
        },
        count :{
            type : Number,
            default : 1
        },
        departments: [
            {
                departmentName: String,
                address: String,
                email : String,
                location: {
                    lat: Number,
                    lng: Number,
                }
            }
        ]
    },
    { timestamps: true }

)

export const GarbageReport = mongoose.models.GarbageReport || mongoose.model("GarbageReport", garbage);