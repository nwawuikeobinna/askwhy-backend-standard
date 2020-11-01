const express = require("express");
const { body } = require("express-validator/check");
const isAuth = require("../../middlewares/is-auth"); // To authenticate users
const profileController = require("../../controllers/profile");

const router = express.Router();

router.get("/profiles", profileController.getAllProfiles);

router.get("/profile", isAuth, profileController.getUserProfile);

router.post(
  "/profile",
  [
    body("handle")
      .isLength({ min: 5 })
      .withMessage("Profile handle is required")
      .trim(),
    body("location").withMessage("Location field is required")
    .withMessage("Profile handle is required").trim(),
    body("skills").withMessage("Skills field is required")
    .withMessage("Skills section is required").trim(),
  ],
  isAuth,
  profileController.profileFields
);

// Get user by the handle and its not authenticated cos someone could search by handle without being authenticated..
router.get("/handle/:handle", profileController.getUserHandle);

router.post(
  "/experience/:profileId",
  [
    body("company")
      .isLength({ min: 5 })
      .withMessage("Company field is required")
      .trim(),
    body("title")
      .isLength({ min: 5 })
      .withMessage("Title field is required")
      .trim(),
    body("location")
      .isLength({ min: 5 })
      .withMessage("Location field is required")
      .trim(),
  ],
  isAuth,
  profileController.experienceFields
);

router.post(
  "/education/:profileId",
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
  ],
  isAuth,
  profileController.educationFields
);

router.delete("/education/:educationId", isAuth, profileController.deleteEdu);

router.delete("/experience/experience_id", isAuth, profileController.deleteExp);

// Delete user and profile
router.delete("/profile", isAuth, profileController.deleteUserAndProfile);

module.exports = router;
