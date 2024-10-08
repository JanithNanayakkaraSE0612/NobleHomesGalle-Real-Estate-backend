const sendResponse = require("../middleware/responseHandler");
const Property = require("../models/Property");
const { upload, cloudinary } = require("../config/cloudinaryConfig");

// Add a new property
exports.addProperty = [
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    const {
      // Common Fields.......................
      type,
      city,
      title,
      titleDescription,
      price,
      parking,
      agent,
      map,
      description,
      // Home Specific Fields.................
      squareFeet,
      bedrooms,
      bathrooms,
      // Land Specific Fields..................
      sizeType,
      size,
      priceType,
      pricePerUnit,
    } = req.body;

    // Handle photos
    const photos = req.files["photos"]
      ? req.files["photos"].map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    // Handle videos
    const videos = req.files["videos"]
      ? req.files["videos"].map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const property = new Property({
      // Common Fields.........................
      type,
      city,
      title,
      titleDescription,
      price,
      agent,
      map,
      description,
      photos,
      videos,
      // property Specific Fields.................
      squareFeet,
      bedrooms,
      bathrooms,
      parking,
      // Land Specific Fields..................
      sizeType,
      size,
      priceType,
      pricePerUnit,
    });

    try {
      const newProperty = await property.save();
      sendResponse(res, "CREATED", newProperty);
    } catch (err) {
      sendResponse(res, "BAD_REQUEST", { message: err.message });
    }
  },
];

// Retreive all properties
exports.getAllProperties = async (req, res) => {
  try {
    const { type } = req.query;

    const query = type ? { type: type } : {};

    const properties = await Property.find(query);
    sendResponse(res, "SUCCESS", properties);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};

// Get property by id
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return sendResponse(res, "NOT_FOUND");
    }
    sendResponse(res, "SUCCESS", property);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};

// update property
exports.updateProperty = [
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const propertyId = req.params.id;

      // Extract existing property data
      const existingProperty = await Property.findById(propertyId);
      if (!existingProperty) {
        return sendResponse(res, "NOT_FOUND");
      }

      // Handling new uploads
      const newPhotos = req.files["photos"]
        ? req.files["photos"].map((file) => ({
            url: file.path,
            public_id: file.filename,
          }))
        : [];
      const newVideos = req.files["videos"]
        ? req.files["videos"].map((file) => ({
            url: file.path,
            public_id: file.filename,
          }))
        : [];

      // Combine existing and new photos/videos (if any)
      const updatedPhotos = [...existingProperty.photos, ...newPhotos];
      const updatedVideos = [...existingProperty.videos, ...newVideos];

      // Update property data
      const updatedData = {
        ...req.body,
        photos: updatedPhotos,
        videos: updatedVideos,
      };

      const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        updatedData,
        {
          new: true,
        }
      );

      sendResponse(res, "SUCCESS", updatedProperty);
    } catch (error) {
      console.error(error);
      sendResponse(res, "SERVER_ERROR");
    }
  },
];

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findByIdAndDelete(propertyId);
    if (!property) {
      return sendResponse(res, "NOT_FOUND");
    }
    sendResponse(res, "SUCCESS", { message: "Property deleted successfully" });
  } catch (err) {
    sendResponse(res, "SERVER_ERROR");
  }
};

// Delete Photos
exports.deletePhoto = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const photoId = req.params.public_id;

    // Find the property by ID
    const property = await Property.findById(propertyId);
    if (!property) {
      return sendResponse(res, "NOT_FOUND");
    }

    // Find and remove the photo by ID
    const photoIndex = property.photos.findIndex((photo) => {
      console.log(photo.public_id);
      return photo.public_id === photoId;
    });
    if (photoIndex === -1) {
      return sendResponse(res, "NOT_FOUND", { message: "Photo not found" });
    }

    const photo = property.photos[photoIndex];

    // Optionally delete the photo from Cloudinary
    const result = await cloudinary.uploader.destroy(photo.public_id, {
      resource_type: "image",
    });

    if (result.result !== "ok") {
      return sendResponse(res, "SERVER_ERROR", {
        message: "Cloudinary deletion failed",
      });
    }

    // Remove the photo from the array
    property.photos.splice(photoIndex, 1);

    // Save the updated property document
    await property.save();

    sendResponse(res, "SUCCESS", property);
  } catch (err) {
    console.error(err);
    sendResponse(res, "SERVER_ERROR");
  }
};

// delete video
exports.deleteVideo = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const videoId = req.params.public_id;

    // Find the property by ID
    const property = await Property.findById(propertyId);
    if (!property) {
      return sendResponse(res, "NOT_FOUND");
    }

    // Find and remove the video by ID
    const videoIndex = property.videos.findIndex((video) => {
      return video.public_id === videoId;
    });
    if (videoIndex === -1) {
      return sendResponse(res, "NOT_FOUND", { message: "Video not found" });
    }

    const video = property.videos[videoIndex];

    // Optionally delete the video from Cloudinary
    const result = await cloudinary.uploader.destroy(video.public_id, {
      resource_type: "video",
    });

    if (result.result !== "ok") {
      return sendResponse(res, "SERVER_ERROR", {
        message: "Cloudinary deletion failed",
      });
    }

    // Remove the video from the array
    property.videos.splice(videoIndex, 1);

    // Save the updated property document
    await property.save();

    sendResponse(res, "SUCCESS", property);
  } catch (error) {
    console.error(err);
    sendResponse(res, "SERVER_ERROR");
  }
};
