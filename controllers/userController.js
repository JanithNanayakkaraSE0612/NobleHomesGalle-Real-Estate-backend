const User = require("../models/User");
const Property = require("../models/Property");
const sendResponse = require("../middleware/responseHandler");
const bcryptjs = require("bcryptjs");
const { upload, cloudinary } = require("../config/cloudinaryConfig");

// create new admin
exports.createAdmin = [
  upload.single("profileImage"),
  async (req, res, next) => {
    const { username, email, password, phone, birthday, joinDate } = req.body;
    try {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const profileImage = req.file
        ? {
            url: req.file.path,
            public_id: req.file.filename,
          }
        : null;

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        phone,
        birthday,
        joinDate,
        profileImage,
        role: "admin", // Ensure the role is set to admin
      });

      await newUser.save();
      res.status(201).json("Admin created");
    } catch (error) {
      next(error);
    }
  },
];

// Create a new agent...............................................
exports.createAgent = async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
      role: "agent",
      profileImage: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });
    await newUser.save();
    sendResponse(res, "SUCCESS", newUser);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};

// Create a new customer and property...............................................
exports.createNewCustomerAndProperty = async (req, res) => {
  try {
    const { customer, property } = req.body;
    // Create and save the new customer first
    const newCustomer = new User({
      ...customer,
      role: "customer",
    });
    await newCustomer.save();

    // Create and save the new property, referencing the new customer's ID
    const newProperty = new Property({
      ...property,
      customer: newCustomer._id,
    });
    await newProperty.save();

    sendResponse(res, "SUCCESS", { newCustomer, newProperty });
  } catch (error) {
    sendResponse(res, "SERVER_ERROR", { message: error.message });
  }
};

//fetch specific user...............................................
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

//update specific user...............................................
exports.UpdateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const existingUserData = await User.findById(userId);

    if (!existingUserData) {
      return sendResponse(res, "NOT_FOUND");
    }

    let newProfileImage = existingUserData.profileImage;

    // If a new file is uploaded, delete the old image from Cloudinary
    if (req.file) {
      if (
        existingUserData.profileImage &&
        existingUserData.profileImage.public_id
      ) {
        await cloudinary.uploader.destroy(
          existingUserData.profileImage.public_id
        );
      }
      newProfileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

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

//delete specific user...............................................
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

//get all users...............................................
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
