const { validationResult } = require("express-validator/check");

// const User = require("../../models/user");
const Post = require("../../models/post");
const Profile = require("../../models/user/profile");

exports.createPost = async (req, res, next) => {
  const { text, name, avatar, user } = req.body;
  //   const { user } = req.userId;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entry data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const post = new Post({
      text: text,
      name: name,
      avatar: avatar,
      user: user,
    });

    await post.save();

    res.status(201).json({
      message: "success",
      post,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.getPost = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const post = await Post.find().sort({ date: -1 });

    if (!post) {
      const error = new Error("There are no post");
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({
      message: "Success",
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.getPostById = async (req, res, next) => {
  const error = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const post = await Post.findById({ id: req.params.id });

    if (!post) {
      const error = new Error("There is no post with this id");
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({
      message: "Success",
      post,
    });
  } catch (err) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};

exports.removePost = async (req, res, next) => {
  const errors = validationResult(req);
};
