const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");
const { upload } = require("../config/cloudinaryConfig");

// Main routes
router.post("/", agentController.addAgent);
router.get("/", agentController.getAllAgents);
router.get("/:id", agentController.getAgentById);
router.put(
  "/update/:id",
  upload.single("authorImage"),
  agentController.updateAgentById
);
router.delete("/delete/:id", agentController.deleteAgent);

module.exports = router;
