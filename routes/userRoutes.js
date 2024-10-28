const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyRole = require("../middleware/roleHandler");
const { upload } = require("../config/cloudinaryConfig");

router.post("/createAdmin", userController.createAdmin);

/**
 * @swagger
 * /api/user/createAgent:
 *   post:
 *     summary: Create a new agent
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image of the agent
 *               username:
 *                 type: string
 *                 example: agent
 *                 description: Username of the agent
 *               email:
 *                 type: string
 *                 example: agent@gmail.com
 *                 description: Email of the agent
 *               phone:
 *                 type: string
 *                 example: 0701012293
 *                 description: Phone number of the agent
 *               joinDate:
 *                 type: string
 *                 format: date
 *                 description: Join date of the agent
 *               streetAddress:
 *                 type: string
 *                 example: cc/1, Colombo
 *                 description: Street address of the agent
 *               province:
 *                 type: string
 *                 example: Western
 *                 description: Province of the agent
 *               city:
 *                 type: string
 *                 example: Kaduwela
 *                 description: City of the agent
 *               zipCode:
 *                 type: string
 *                 example: 72000
 *                 description: Zip code of the agent
 *     responses:
 *       201:
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SERVER_ERROR
 */
router.post(
  "/createAgent",
  upload.single("profileImage"),
  userController.createAgent
);

/**
 * @swagger
 * /api/user/createNewCustomerAndProperty:
 *   post:
 *     summary: Create a new customer and property
 *     tags: [Customer, Property]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: John Doe
 *                     description: Username of the customer
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *                     description: Email of the customer
 *                   phone:
 *                     type: string
 *                     example: 1234567890
 *                     description: Phone number of the customer
 *                   joinDate:
 *                     type: string
 *                     format: date
 *                     description: Join date of the customer
 *                   streetAddress:
 *                     type: string
 *                     example: 123 Main St
 *                     description: Street address of the customer
 *                   province:
 *                     type: string
 *                     example: Western
 *                     description: Province of the customer
 *                   city:
 *                     type: string
 *                     example: Kaduwela
 *                     description: City of the customer
 *                   zipCode:
 *                     type: string
 *                     example: 72000
 *                     description: Zip code of the customer
 *               property:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: ["house", "land"]
 *                     example: land
 *                     description: Type of the property
 *                   title:
 *                     type: string
 *                     example: Beautiful House
 *                     description: Title of the property
 *                   sizeType:
 *                     type: string
 *                     example: Large
 *                     description: Size type of the property
 *                   size:
 *                     type: number
 *                     example: 5000
 *                     description: Size of the property
 *                   priceType:
 *                     type: string
 *                     example: Per Acre
 *                     description: Price type of the property
 *                   pricePerUnit:
 *                     type: number
 *                     example: 1000
 *                     description: Price per unit of the property
 *                   map:
 *                     type: string
 *                     example: http://example.com/map
 *                     description: Map location of the property
 *                   agent:
 *                     type: string
 *                     example: 60d0fe4f5311236168a109ca
 *                     description: Agent ID responsible for the property
 *                   squareFeet:
 *                     type: number
 *                     example: 2000
 *                     description: Square footage of the property
 *                   bedrooms:
 *                     type: number
 *                     example: 3
 *                     description: Number of bedrooms in the property
 *                   bathrooms:
 *                     type: number
 *                     example: 2
 *                     description: Number of bathrooms in the property
 *                   parking:
 *                     type: string
 *                     example: Garage
 *                     description: Parking availability for the property
 *     responses:
 *       201:
 *         description: Customer and property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *                 property:
 *                   $ref: '#/components/schemas/Property'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SERVER_ERROR
 */
router.post(
  "/createNewCustomerAndProperty",
  userController.createNewCustomerAndProperty
);

/**
 * @swagger
 * /api/user/get/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user data
 *       404:
 *         description: User not found
 */
router.get("/get/:id", userController.getUserById);
/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Update user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthday:
 *                 type: string
 *               streetAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user data
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */
router.put(
  "/update/:id",
  upload.single("profileImage"),
  verifyRole(["admin", "user"]),
  userController.UpdateUser
);
/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/delete/:id", userController.deleteUser);
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 */
router.get("/", verifyRole(["admin"]), userController.getAllUsers);

module.exports = router;
