const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { sendPasswordResetEmail } = require("../utils/emailService");
const { generateResetToken } = require("../utils/crypto");
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

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    const resetToken = generateResetToken();

    // Hash the token and save it with the user (for security reasons)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    console.log("Protocol:", req.protocol); // Should log "http" or "https"
    console.log("Host:", req.get("host")); // Should log "localhost:5000

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetpassword/${resetToken}`;

    console.log("Reset URL:", resetUrl);

    await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    next(error);
  }
};

exports.ResetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
    });

    if (!user) {
      console.log("User not found.");

      return next(errorHandler(400, "Invalid or expired token"));
    }
    if (user.resetPasswordExpires < Date.now()) {
      return next(errorHandler(400, "Invalid or expired token"));
    }

    const hasshedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hasshedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "password has been reset successfully" });
  } catch (error) {
    next(error);
  }
};
