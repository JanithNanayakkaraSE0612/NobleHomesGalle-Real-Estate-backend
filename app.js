const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const propertyRoutes = require("./routes/propertyRoutes");
// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(morgan("dev")); // For logging requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.get("/", (req, res) => {
  res.send("Real Estate Backend API");
});

app.use("/api/property", propertyRoutes);

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
