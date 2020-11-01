const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  // associating the user with profile
  user: {
    type: mongoose.Types.ObjectId, //associating user with profile
    ref: "user",
  },
  handle: {
    type: String,
    required: true,
    max: 40,
  },
   status: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], //array of string.. in the form its gon be a comma sperated value
    
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },

  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        // required: true,
      },
      handle: {
        type: String,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],

  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      descripton: {
        type: String,
      },
    },
  ],

  social: {
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
