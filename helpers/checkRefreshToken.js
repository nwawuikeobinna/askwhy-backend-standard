const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const checkRefreshToken = (token) => {
  if (token) {
    const decoded = jwt.verify(token, keys.TOKEN_SECRET_KEY);
    return decoded.userId;
  }

  return null;
};

exports.checkRefreshToken = checkRefreshToken;
