const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const generateToken = (userId) => {
  return jwt.sign({ userId }, keys.TOKEN_SECRET_KEY, { expiresIn: "7 days" });
};

exports.generateToken = generateToken;
