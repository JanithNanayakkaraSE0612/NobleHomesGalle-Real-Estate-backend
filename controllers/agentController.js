const sendResponse = require("../middleware/responseHandler");
const Agent = require("../models/Agent");
const { upload, cloudinary } = require("../config/cloudinaryConfig");

// Add a new agent
exports.addAgent = [
  upload.single("authorImage"),
  async (req, res) => {
    const {
      agentName,
      agentEmail,
      agentPhone,
      agentAddress,
      agentProvince,
      agentCity,
      agentZipCode,
    } = req.body;

    const authorImage = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    const agent = new Agent({
      authorImage,
      agentName,
      agentEmail,
      agentPhone,
      agentAddress,
      agentProvince,
      agentCity,
      agentZipCode,
    });

    try {
      await agent.save();
      sendResponse(res, "CREATED", agent);
    } catch (err) {
      sendResponse(res, "BAD_REQUEST", { message: err.message });
    }
  },
];

// Get all agents

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    sendResponse(res, "SUCCESS", agents);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};

// Get Agent by Id

exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return sendResponse(res, "NOT_FOUND");
    }
    sendResponse(res, "SUCCESS", agent);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};

// Update Agent by Id

exports.updateAgentById = async (req, res) => {
  try {
    const agentId = req.params.id;

    const existingAgentData = await Agent.findById(agentId);
    // console.log("agent Data", existingAgentData);
    if (!existingAgentData) {
      return sendResponse(res, "NOT_FOUND");
    }

    const newAuthorImage = req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
        }
      : existingAgentData.authorImage;

    const updatedData = {
      authorImage: newAuthorImage,
      agentName: req.body.agentName || existingAgentData.agentName,
      agentEmail: req.body.agentEmail || existingAgentData.agentEmail,
      agentPhone: req.body.agentPhone || existingAgentData.agentPhone,
      agentAddress: req.body.agentAddress || existingAgentData.agentAddress,
      agentProvince: req.body.agentProvince || existingAgentData.agentProvince,
      agentCity: req.body.agentCity || existingAgentData.agentCity,
      agentZipCode: req.body.agentZipCode || existingAgentData.agentZipCode,
    };

    const updatedAgent = await Agent.findByIdAndUpdate(agentId, updatedData, {
      new: true,
    });

    sendResponse(res, "SUCCESS", updatedAgent);
  } catch (err) {
    sendResponse(res, "SERVER_ERROR");
  }
};

// Delete Agent by Id

exports.deleteAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await Agent.findByIdAndDelete(agentId);
    if (!agent) {
      return sendResponse(res, "NOT_FOUND");
    }

    await cloudinary.uploader.destroy(agent.authorImage.public_id);

    sendResponse(res, "SUCCESS", { message: "Agent deleted successfully" });
  } catch (err) {
    sendResponse(res, "SERVER_ERROR", { message: err.message });
  }
};
