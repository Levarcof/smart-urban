import mongoose from "mongoose"

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected")
  } catch (error) {
    console.log("DB connection error:", error)
    throw new Error("Database connection failed")
  }
}

export default connectDB
