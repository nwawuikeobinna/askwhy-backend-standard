const express = require("express");
const { body } = require("express-validator/check");
const isAuth = require("../../middlewares/is-auth"); // To authenticate users

const postController = require("../../controllers/post");

const router = express.Router();

router.post(
  "/post",
  [
    body("text")
      .isLength({ min: 10, max: 300 })
      .withMessage("Text field is required")
      .trim(),
  ],
  isAuth,
  postController.createPost
);

router.get("/post", postController.getPost);

router.get("/:id", postController.getPostById);

module.exports = router;
