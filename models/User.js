const e = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profileImage: {
    public_id: { type: String },
    url: { type: String },
  },
  username: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "customer", "agent"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  resetPasswordToken: { type: String }, // For storing hashed token
  resetPasswordExpires: { type: Date },
  phone: {
    type: Number,
  },
  birthday: {
    type: Date,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  streetAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  province: {
    type: String,
  },
  zipCode: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
