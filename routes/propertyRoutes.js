const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/propertyController");

// Main routes
router.post("/", propertyController.addProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/update/:id", propertyController.updateProperty);
router.delete("/delete/:id", propertyController.deleteProperty);

// Sub routes
router.delete("/remove/:id/photos/:public_id", propertyController.deletePhoto);
router.delete("/remove/:id/videos/:public_id", propertyController.deleteVideo);

module.exports = router;
