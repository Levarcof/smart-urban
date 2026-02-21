import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
   image: {
    type: String, // Cloudinary URL
    default: "",  // Initially empty, will be set after upload
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }

});

export default mongoose.models.User || mongoose.model("User", UserSchema);
