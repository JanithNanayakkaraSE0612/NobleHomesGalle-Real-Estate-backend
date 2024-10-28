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
    minlength: [6, "Password must be at least 6 characters long"],
    validate: {
      validator: function (v) {
        // Password is required only if the role is admin
        return this.role !== "admin" || (this.role === "admin" && v);
      },
      message: "Password is required for admin users",
    },
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  resetPasswordOTP: { type: String }, // For storing hashed token
  resetPasswordExpires: { type: Date },
  otpVerified: {
    type: Boolean,
    default: false,
  },
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
