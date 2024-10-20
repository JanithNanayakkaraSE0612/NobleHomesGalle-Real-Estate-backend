const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_HOST,
      to: email,
      subject: "Your OTP for Password Reset",
      html: `
      <p>You requested to reset your password</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 1 hour.</p>
    `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error to sending email", error);
    throw error;
  }
};
