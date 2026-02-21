import mongoose from "mongoose";

const garbageDepartmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String, // Cloudinary URL
            default: "",  // Initially empty, will be set after upload
        },

        location: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        }
    },
    { timestamps: true }
);

export default mongoose.models.GarbageDepartment ||
    mongoose.model("GarbageDepartment", garbageDepartmentSchema);
