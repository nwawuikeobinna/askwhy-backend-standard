const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const returnUser = async (email) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    const error = new Error("A user with this email could not be found.");
    error.statusCode = 401;
    error.data = "A user with this email could not be found.";
    throw error;
  }

  returnUser;
};

exports.returnUser = returnUser;
