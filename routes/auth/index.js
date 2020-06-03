const express = require('express');
const { body } = require('express-validator/check');
const authController = require('../../controllers/auth');  // My own comment(to hash the password instead of bring bcrypt)
const router = express.Router();

// router.get('/test', (req, res) => res.json({msg:"It works"}));

router.post('/signup', [
    body('name'),
    body('email'),
    body('password')
])

module.exports = router;  //This will be exported so i could use the route in app.js
