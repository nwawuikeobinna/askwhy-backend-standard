const express = require('express');

const router = express.Router();

router.get('/test', (req, res) => res.json({msg:"It works"}));

module.exports = router;  //This will be exported so i could use the route in app.js
