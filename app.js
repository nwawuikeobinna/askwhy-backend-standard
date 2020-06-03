const express = require("express");
const bodyParser = require('body-parser');

const mongoose = require("mongoose");

const db = require("./config/keys").MONGODB_URI;

// Routes
const authRoutes = require("./routes/auth");

const app = express();

//bodyParser middleware
app.use(bodyParser.json());

// Using the Routes
app.use("/api/v1/auth", authRoutes);

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Node Server
    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log(`localhost:${port}`);
  })
  .catch((err) => {
    console.log(err);
  })
  
