const express = require('express');
const { body } = require('express-validator/check');
const authController = require('../../controllers/auth');  // My own comment(to hash the password instead of bring bcrypt)
const isAuth = require('../../middlewares/is-auth');  //To check if the user is authenticted(for authentication)

const router = express.Router();

router.get('/test', (req, res) => res.json({msg:"It works"}));

router.post('/signup', [
    body('name')
    .isLength({ min: 5 })
    .withMessage('Name field is required')
    .trim(),
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({ min: 5 })
], authController.signup)

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Email field is required')
    .normalizeEmail(),
    body('password')
    .trim()
    .withMessage('Password field is required')
], authController.login);

module.exports = router;  //This will be exported so i could use the route in app.js
