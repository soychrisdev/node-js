import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: [String], required: true, enum: ['ADMIN', 'USER'], default: ['USER'] },
  img: { type: String },
})

export const userModel = mongoose.model('User', userSchema);