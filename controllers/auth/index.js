const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const User = require("../../models/user");

// const { checkRefreshToken } = require("../../helpers/checkRefreshToken");
const { returnUser } = require("../../helpers/returnUser");
const { generateToken } = require("../../helpers/generateToken");
const { getUserIdToken } = require("../../helpers/getUserIdToken");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  const { name, email, password } = req.body;

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entry data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({
        success: false,
        message: "This email is in use by another user.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully..",
    });

    // Send a complete signup email to user mail box
    // sendMail(completeSignupTemplate(user, token));
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Oops, something went wrong ");
    error.statusCode = 401;
    error.data = errors.array();
    throw error;
  }

  const { email, password } = req.body;

  try {
    const user = await returnUser(email);

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong Password");

      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      token: generateToken(user._id),
      user,
      message: "Login successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
