const express = require("express");
const { body } = require("express-validator/check");
const isAuth = require("../../middlewares/is-auth"); // To authenticate users

const postController = require("../../controllers/post");
const { route } = require("../auth");

const router = express.Router();

router.post(
  "/posts",
  [
    body("text")
      .isLength({ min: 10, max: 300 })
      .withMessage("Text field is required")
      .trim(),
  ],
  isAuth,
  postController.createPost
);

// fffff
router.get("/posts", postController.getPost);

router.get("/posts/:id", postController.getPostById);

// Delete post
router.delete("/posts/:id", isAuth, postController.removePost);

// Like post
router.post("/like/:id", isAuth, postController.likePost);

// Unlike post
router.post("/unlike/:id", isAuth, postController.unLikePost);

// Comment
router.post(
  "/comment/:id",
  [body("text").withMessage("Text field is required").trim()],
  isAuth,
  postController.commentPost
);

// Remove comment
router.post("/comment/:id/:comment_id", isAuth, postController.removeComment);

module.exports = router;
