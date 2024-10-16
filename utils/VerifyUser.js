const { errorHandler } = require("./ErrorHandler");

const jwt = require("jsonwebtoken");

exports.verifyUser = (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) return next(errorHandler(401, "you are not authenticated"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "token is not valid"));
    req.user = user;
    next();
  });
};
