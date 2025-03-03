const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const setupSwagger = require("./config/swaggerConfig");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(bodyParser.json()); // For parsing JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded bodies
app.use(cookieParser()); // For parsing cookies
app.use(morgan("dev")); // For logging requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Setup Swagger
setupSwagger(app);

// Routes
app.get("/", (req, res) => {
  res.send("Real Estate Backend API");
});

app.use("/api/property", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Handle errors (404, etc.)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
