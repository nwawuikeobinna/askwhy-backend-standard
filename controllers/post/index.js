const { validationResult } = require("express-validator/check");

const User = require("../../models/user");
const Post = require("../../models/post");
const Profile = require("../../models/user/profile");

exports.createPost = async (req, res, next) => {
  const { text, name, avatar } = req.body;
  const user = req.userId;

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
    // user.set({ post: post });
    // user.save();
    // console.log();

    res.status(200).json({
      message: "Post added successfully",
      post,
    });
  } catch (error) {
    if (!error.statusCode) {
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

    const post = await Post.find().sort({ date: -1 }).populate("user");

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
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const post = await Post.findById(req.params.id);

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
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.removePost = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const post = await Post.findById(req.params.id);

    // Check for post owner
    if (post.user.toString() !== req.userId) {
      const error = new Error("User not authorised");
      error.statusCode = 401;
      throw error;
    }

    // Delete
    await post.remove();

    res.status(201).json({
      message: "Post deleted successful",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Like post
exports.likePost = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error("Post not found!");
    }

    // Check if the user have liked post once
    if (
      post.likes.filter((like) => like.user.toString() === req.userId).length >
      0
    ) {
      return res.status(400).json({ message: "User already liked this post" });
    }

    //Add user id to likes array
    post.likes.unshift({ user: req.userId });

    await post.save();

    res.status(201).json({
      message: "Success",
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Unlike post
exports.unLikePost = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error("Post not found!");
    }

    // Check if user have liked post once
    if (
      post.likes.filter((like) => like.user.toString() === req.userId)
        .length === 0
    ) {
      return res.status(400).json({
        message: "You have not liked this post",
      });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((item) => item.user.toString())
      .indexOf(req.userId);

    // Remove or Splice out of array
    post.likes.splice(removeIndex, 1);

    //Save
    await post.save();

    res.status(201).json({
      message: "unliked successfully",
      // post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Comment ..... Adding comments to post 
exports.commentPost = async (req, res, next) => {
  const { text, name, avatar } = req.body;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const post = await Post.findById(req.params.id);
    // console.log(_id);

    if (!post) {
      throw new Error("No comment for this post");
    }

    const data = {
      text: text,
      name: name,
      avatar: avatar,
      user: req.userId,
    };

    // Add to comment array
    post.comments.push(data);

    // Save
    await post.save();

    res.status(201).json({
      message: "Comment added successfully",
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Remove comment from post
exports.removeComment = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const post = await Post.findById(req.params.id);

    // Check if the comment exist
    if (
      post.comment.filter(
        (comment) => comment._id.toString() === req.params.comment_id
      ).length === 0
    )
      res.status(400).json({
        success: false,
        message: "Comment does not exist",
      });

    // Get remove index
    const removeIndex = post.comments
      .map((item) => item._id.toString())
      .indexOf(req.params.comment_id);

    // Remove/Slice item out of array
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.status(201).json({
      message: 'Comment removed successfully',
      success: true,
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
