const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");
const { upload } = require("../config/cloudinaryConfig");

// Main routes.............................................................................

// Add a new agent
/**
 * @swagger
 * /api/agent:
 *   post:
 *     tags:
 *     - Agent
 *     summary: Add a new agent with an image
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               authorImage:
 *                 type: string
 *                 format: binary
 *                 description: Upload an image
 *               agentName:
 *                 type: string
 *                 description: The name of the agent
 *               agentEmail:
 *                 type: string
 *                 description: The email of the agent
 *               agentPhone:
 *                 type: number
 *                 description: The phone number of the agent
 *               agentAddress:
 *                 type: string
 *                 description: The address of the agent
 *               agentProvince:
 *                 type: string
 *                 description: The province of the agent
 *               agentCity:
 *                 type: string
 *                 description: The city of the agent
 *               agentZipCode:
 *                 type: number
 *                 description: The zip code of the agent
 *     responses:
 *       201:
 *         description: Agent added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 */
router.post("/", agentController.addAgent);

// Get all agents
/**
 * @swagger
 * /api/agent:
 *   get:
 *     tags:
 *     - Agent
 *     summary: Get all agents
 *     responses:
 *       200:
 *         description: All agents
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 */
router.get("/", agentController.getAllAgents);

// Get an agent by ID
/**
 * @swagger
 * /api/agent/{id}:
 *   get:
 *     tags:
 *     - Agent
 *     summary: Get an agent by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the agent
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An agent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 */
router.get("/:id", agentController.getAgentById);

// Update an agent by ID
/**
 * @swagger
 * /api/agent/update/{id}:
 *   put:
 *     tags:
 *     - Agent
 *     summary: Update an agent by ID
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the agent
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               authorImage:
 *                 type: string
 *                 format: binary
 *                 description: Upload an image
 *               agentName:
 *                 type: string
 *                 description: The name of the agent
 *               agentEmail:
 *                 type: string
 *                 description: The email of the agent
 *               agentPhone:
 *                 type: number
 *                 description: The phone number of the agent
 *               agentAddress:
 *                 type: string
 *                 description: The address of the agent
 *               agentProvince:
 *                 type: string
 *                 description: The province of the agent
 *               agentCity:
 *                 type: string
 *                 description: The city of the agent
 *               agentZipCode:
 *                 type: number
 *                 description: The zip code of the agent
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 */
router.put(
  "/update/:id",
  upload.single("authorImage"),
  agentController.updateAgentById
);

// Delete an agent by ID

/**
 * @swagger
 * /api/agent/delete/{id}:
 *   delete:
 *     tags:
 *     - Agent
 *     summary: Delete an agent by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the agent
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 */
router.delete("/delete/:id", agentController.deleteAgent);

module.exports = router;
