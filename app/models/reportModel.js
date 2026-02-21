import mongoose from "mongoose"

const reportSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    address: String,
    location: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
)

export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema)
