const User = require("../models/User");
const sendResponse = require("../middleware/responseHandler");
const { upload, cloudinary } = require("../config/cloudinaryConfig");

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendResponse(res, "NOT_FOUND");
    }
    sendResponse(res, "SUCCESS", user);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};

exports.UpdateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const existingUserData = await User.findById(userId);

    if (!existingUserData) {
      return sendResponse(res, "NOT_FOUND");
    }

    const newProfileImage = req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
        }
      : existingUserData.profileImage;

    const updatedData = {
      profileImage: newProfileImage,
      username: req.body.username || existingUserData.username,
      email: req.body.email || existingUserData.email,
      role:
        req.user.role === "admin"
          ? req.body.role || existingUserData.role
          : existingUserData.role, // Only admin can update role
      phone: req.body.phone || existingUserData.phone,
      birthday: req.body.birthday || existingUserData.birthday,
      streetAddress: req.body.streetAddress || existingUserData.streetAddress,
      city: req.body.city || existingUserData.city,
      province: req.body.province || existingUserData.province,
      zipCode: req.body.zipCode || existingUserData.zipCode,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    sendResponse(res, "SUCCESS", updatedUser);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return sendResponse(res, "NOT_FOUND");
    }

    await cloudinary.uploader.destroy(user.profileImage.public_id);

    sendResponse(res, "SUCCESS", { message: "User deleted successfully" });
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role: queryRole } = req.query;

    const query = queryRole ? { role: queryRole } : {};

    const users = await User.find(query);
    sendResponse(res, "SUCCESS", users);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};
