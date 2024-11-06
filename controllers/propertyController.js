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
      const updatedPhotos =
        newPhotos.length > 0
          ? [...existingProperty.photos, ...newPhotos]
          : existingProperty.photos;
      const updatedVideos =
        newVideos.length > 0
          ? [...existingProperty.videos, ...newVideos]
          : existingProperty.videos;

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

    const property = await Property.findById(propertyId);

    if (!property) {
      return sendResponse(res, "NOT_FOUND");
    }

    // Delete photos from Cloudinary
    if (property.photos && property.photos.length > 0) {
      for (const photo of property.photos) {
        await cloudinary.uploader.destroy(photo.public_id);
      }
    }

    // Delete videos from Cloudinary
    if (property.videos && property.videos.length > 0) {
      for (const video of property.videos) {
        await cloudinary.uploader.destroy(video.public_id, {
          resource_type: "video",
        });
      }
    }

    // Delete the property from the database
    await Property.findByIdAndDelete(propertyId);

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

//replace individual photo using public_id
exports.replacePhoto = [
  upload.single("photo"), // Expecting a single photo upload
  async (req, res) => {
    try {
      const propertyId = req.params.id;
      const photoId = req.params.public_id;

      // Find the property by ID
      const property = await Property.findById(propertyId);
      if (!property) {
        return sendResponse(res, "Property_NOT_FOUND");
      }

      // Find the photo by ID
      const photoIndex = property.photos.findIndex(
        (photo) => photo.public_id === photoId
      );
      if (photoIndex === -1) {
        return sendResponse(res, "NOT_FOUND", { message: "Photo not found" });
      }

      // Get the photo to be replaced
      const oldPhoto = property.photos[photoIndex];

      // Delete the old photo from Cloudinary
      await cloudinary.uploader.destroy(oldPhoto.public_id, {
        resource_type: "image",
      });

      // Upload the new photo to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: req.file.filename, // Set the public ID to be the file's name
        resource_type: "image", // Specify that it's an image
      });

      // Replace the old photo with the new one in the property document
      property.photos[photoIndex] = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      // Save the updated property document
      await property.save();
      sendResponse(res, "SUCCESS", property);
    } catch (err) {
      console.error(err);
      sendResponse(res, "SERVER_ERROR", { message: err.message });
    }
  },
];

// Replace individual video using public_id
exports.replaceVideo = [
  upload.single("video"),
  async (req, res) => {
    try {
      const propertyId = req.params.id;
      const videoId = req.params.public_id;

      // Find the property by ID
      const property = await Property.findById(propertyId);
      if (!property) {
        return sendResponse(res, "NOT_FOUND");
      }

      // Find the video by ID
      const videoIndex = property.videos.findIndex(
        (video) => video.public_id === videoId
      );
      if (videoIndex === -1) {
        return sendResponse(res, "NOT_FOUND", { message: "Video not found" });
      }

      // Get the video to be replaced
      const oldVideo = property.videos[videoIndex];

      // Delete the old video from Cloudinary
      await cloudinary.uploader.destroy(oldVideo.public_id, {
        resource_type: "video",
      });

      // Upload the new video to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: req.file.filename,
        resource_type: "video",
      });

      // Replace the video in the property document
      property.videos[videoIndex] = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      // Save the updated property document
      await property.save();

      sendResponse(res, "SUCCESS", property);
    } catch (err) {
      console.error(err);
      sendResponse(res, "SERVER_ERROR", { message: err.message });
    }
  },
];

//retriving agent specifiy properties
exports.getPropertyByAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    const properties = await Property.find({ agent: agentId });
    sendResponse(res, "SUCCESS", properties);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};
