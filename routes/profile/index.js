const express = require("express");
const { body } = require("express-validator/check");
const isAuth = require("../../middlewares/is-auth"); // To authenticate users
const profileController = require("../../controllers/profile");

const router = express.Router();

router.get("/profile", isAuth, profileController.getUserProfile);

router.post(
  "/profile",
  [
    body("handle")
      .isLength({ min: 5 })
      .withMessage("Profile handle is required")
      .trim(),
    body("status").withMessage("Status field is required").trim(),
    body("skills").withMessage("Skills field is required").trim(),
  ],
  profileController.profileFields
);

// Get user by the handle and its not authenticated cos someone could search by handle without being authenticated..
router.get("/handle/:handle", profileController.getUserHandle);

router.post(
  "/experience",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("title field is required")
      .trim(),
    body("company")
      .isLength({ min: 5 })
      .withMessage("company field is required")
      .trim(),
    body("from")
      .isLength({ min: 5 })
      .withMessage("from field is required")
      .trim(),
  ],
  isAuth,
  profileController.experienceFields
);

router.post(
  "/education",
  [
    body("school")
      .isLength({ min: 5 })
      .withMessage("School field is required")
      .trim(),
    body("degree")
      .isLength({ min: 5 })
      .withMessage("Degree field is required")
      .trim(),
    body("fieldofstudy")
      .isLength({ min: 5 })
      .withMessage("Fieldofstudy is required")
      .trim(),
    body("from")
      .isLength({ min: 5 })
      .withMessage("From field is required")
      .trim(),
  ],
  isAuth,
  profileController.educationFields
);

router.delete("/education/education_id", isAuth, profileController.deleteEdu);

router.delete("/experience/experience_id", isAuth, profileController.deleteExp);

// Delete user and profile
router.delete("/", isAuth, profileController.deleteUserAndProfile);

module.exports = router;
