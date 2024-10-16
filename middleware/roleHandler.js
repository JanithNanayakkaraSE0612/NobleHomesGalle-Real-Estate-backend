const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const verifyRole = (roles) => {
  return async (req, res, next) => {
    try {
      const token =
        req.cookies.access_token || req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "You are not authenticated" });
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "You are not authorized" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ message: "Access denied. Invalid token" });
    }
  };
};

module.exports = verifyRole;
