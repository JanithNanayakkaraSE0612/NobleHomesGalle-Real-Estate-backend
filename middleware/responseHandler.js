const responses = require("../constants/responses");

const sendResponse = (res, responseType, data = null) => {
  const { code, message } = responses[responseType];
  res.status(code).json({ message, data });
};

module.exports = sendResponse;
