const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/emailService");
const crypto = require("crypto");
dotenv.config();

exports.SignUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hasshedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hasshedPassword });
    await newUser.save();
    res.status(201).json("user created");
  } catch (error) {
    next(error);
  }
};

exports.Signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log(email);
    const valid_user = await User.findOne({ email });
    if (!valid_user) return next(errorHandler(404, "user not found"));
    const isMatch = bcryptjs.compareSync(password, valid_user.password);
    if (!isMatch) return next(errorHandler(401, "invalid credentials"));
    const token = jwt.sign(
      { id: valid_user._id, role: valid_user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res
      .status(200)
      .json({ message: "Login successful", user: valid_user, token });
  } catch (error) {
    next(error);
  }
};

exports.Google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      res.status(200).json(user);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hasshedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hasshedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      res.status(200).json(newUser);
    }
  } catch (error) {
    next(error);
  }
};

exports.Signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.json("user has been signed out");
  } catch (error) {
    next(error);
  }
};

exports.ForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  // Generate a random OTP (6 digits)
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  };

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    // Generate OTP
    const otp = generateOTP();

    // Hash the OTP and save to the user (for security reasons)
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");
    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordExpires = Date.now() + 3600000; // OTP expires in 1 hour
    user.otpVerified = false;
    await user.save();

    // Send OTP via email
    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: "OTP sent to email for password reset" });
  } catch (error) {
    next(error);
  }
};

exports.VerifyOTP = async (req, res, next) => {
  const { otp } = req.body;

  try {
    // Hash the provided OTP to compare it with the stored hashed OTP
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    // Find the user by OTP and check its validity
    const user = await User.findOne({
      resetPasswordOTP: hashedOTP,
      resetPasswordExpires: { $gt: Date.now() }, // Check if OTP is still valid
    });

    if (!user) {
      return next(errorHandler(400, "Invalid or expired OTP"));
    }

    // Flag the user as OTP verified (e.g., add a field in the database)
    user.otpVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
};

exports.ResetPassword = async (req, res, next) => {
  const { newPassword } = req.body;

  try {
    // Find the user based on the resetPasswordOTP and check OTP expiry
    const user = await User.findOne({
      otpVerified: true,
    });

    if (!user) {
      return next(errorHandler(400, "OTP verification required"));
    }

    // Hash the new password and update the user's password
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedPassword;

    // Clear the OTP and expiry fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    user.otpVerified = false;

    await user.save();

    res.status(200).json({ message: "password has been reset successfully" });
  } catch (error) {
    next(error);
  }
};
