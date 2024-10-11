const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/propertyController");

// Main routes.............................................................................

// Add a new property

/**
 * @swagger
 * /api/property:
 *   post:
 *     tags:
 *     - Property
 *     summary: Add a new property with photos and videos
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of the property (house/land)
 *               city:
 *                 type: string
 *                 description: The city where the property is located
 *               title:
 *                 type: string
 *                 description: The title of the property
 *               titleDescription:
 *                 type: string
 *                 description: A description of the title
 *               price:
 *                 type: number
 *                 description: The price of the property
 *               agent:
 *                 type: string
 *                 description: The agent responsible for the property
 *               map:
 *                 type: string
 *                 description: A URL to the map location of the property
 *               description:
 *                 type: string
 *                 description: A detailed description of the property
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Upload photo files
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Upload video files
 *     responses:
 *       201:
 *         description: Property added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Bad request
 */
router.post("/", propertyController.addProperty);

// Get all properties

/**
 * @swagger
 * /api/property:
 *   get:
 *     tags:
 *     - Property
 *     summary: Get all properties
 *     responses:
 *       200:
 *         description: A list of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 */
router.get("/", propertyController.getAllProperties);

// Get a property by ID

/**
 * @swagger
 * /api/property/{id}:
 *   get:
 *     tags:
 *     - Property
 *     summary: Get a property by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The property ID
 *     responses:
 *       200:
 *         description: A property object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
router.get("/:id", propertyController.getPropertyById);

// Update a property

/**
 * @swagger
 * /api/property/update/{id}:
 *   put:
 *     tags:
 *     - Property
 *     summary: Update a property by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The property ID
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of the property (house/land)
 *               city:
 *                 type: string
 *                 description: The city where the property is located
 *               title:
 *                 type: string
 *                 description: The title of the property
 *               titleDescription:
 *                 type: string
 *                 description: A description of the title
 *               price:
 *                 type: number
 *                 description: The price of the property
 *               agent:
 *                 type: string
 *                 description: The agent responsible for the property
 *               map:
 *                 type: string
 *                 description: A URL to the map location of the property
 *               description:
 *                 type: string
 *                 description: A detailed description of the property
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Upload photo files
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Upload video files
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Property not found
 */
router.put("/update/:id", propertyController.updateProperty);

// Delete a property

/**
 * @swagger
 * /api/property/delete/{id}:
 *   delete:
 *     tags:
 *     - Property
 *     summary: Delete a property by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 */
router.delete("/delete/:id", propertyController.deleteProperty);

// Sub routes...............................................................................

// Delete a photo from a property
/**
 * @swagger
 * /api/property/remove/{id}/photos/{public_id}:
 *   delete:
 *     tags:
 *     - Property
 *     summary: Delete a photo from a property
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The property ID
 *       - in: path
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The public ID of the photo
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 *       404:
 *         description: Property or photo not found
 */
router.delete("/remove/:id/photos/:public_id", propertyController.deletePhoto);

// delete video from property

/**
 * @swagger
 * /api/property/remove/{id}/videos/{public_id}:
 *   delete:
 *     tags:
 *     - Property
 *     summary: Delete a video from a property
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The property ID
 *       - in: path
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The public ID of the video
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Property or video not found
 */
router.delete("/remove/:id/videos/:public_id", propertyController.deleteVideo);

// Get properties by agent

/**
 * @swagger
 * /api/property/agent/{id}:
 *   get:
 *     tags:
 *     - Property
 *     summary: Get all properties by agent ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The agent ID
 *     responses:
 *       200:
 *         description: A list of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       404:
 *         description: Agent not found
 */
router.get("/agent/:id", propertyController.getPropertyByAgent);

module.exports = router;
