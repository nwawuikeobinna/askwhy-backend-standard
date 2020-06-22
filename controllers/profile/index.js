const { validationResult } = require("express-validator/check");

const Profile = require("../../models/user/profile");
const User = require("../../models/user");

exports.getUserProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const profile = await User.findById(req.userId);

    if (!profile) {
      const error = new Error("There is no profile for this user");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Success",
      profile,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.profileFields = async (req, res, next) => {
  const {
    handle,
    company,
    skills,
    website,
    location,
    bio,
    status,
    githubusername,
  } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entry data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const handleExist = await Profile.findOne({ handle: handle });

    if (handleExist) {
      const error = new Error("Handle is existing, try another handle.");
      error.statusCode = 422;
      throw error;
    }

    const profile = new Profile({
      handle: handle,
      company: company,
      skills: skills,
      website: website,
      location: location,
      bio: bio,
      status: status,
      githubusername: githubusername,
    });

    await profile.save();

    res.status(201).json({
      message: "Success",
      profile,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Get profile by user handle
exports.getUserHandle = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Oops, something went wrong ");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const profile = await Profile.findOne({ handle: req.params.handle });

    if (!profile) {
      const error = new Error("There is no profile for this user");
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({
      message: "success",
      profile,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.experienceFields = async (req, res, next) => {
  const { title, company, location, from, to, current, description } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entry data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const experience = Profile.findOne({ user: req.userId });

    if (!experience) {
      const error = new Error("There is no experience for this user");
      error.statusCode = 404;
      throw error;
    }

    const profile = new Profile({
      title: title,
      company: company,
      location: location,
      from: from,
      to: to,
      current: current,
      description: description,
    });

    // Add to exp array
    profile.experience.unshift(new Profile());

    await profile.save();

    res.status(201).json({
      message: "Success",
      profile,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.educationFields = async (req, res, next) => {
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entry data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const education = Profile.findOne({ user: req.userId });

    if (!education) {
      const error = new Error("There is no education for this user");
      error.statusCode = 404;
      throw error;
    }

    const profile = new Profile({
      school: school,
      degree: degree,
      fieldofstudy: fieldofstudy,
      from: from,
      to: to,
      current: current,
      description: description,
    });

    // Add to exp array
    profile.education.unshift(new Profile());

    await profile.save();

    res.status(201).json({
      message: "Success",
      profile,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteEdu = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });

    if (!profile) {
      const error = new Error("Profile not deleted");
      error.statusCode = 404;
      throw error;
    }

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(rq.params.education_id);

    // Splice out of the array
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.status(201).json({
      message: "success",
      profile,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteExp = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });

    if (!profile) {
      const error = new Error("Experience not deleted");
      error.statusCode = 404;
      throw error;
    }

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(rq.params.experience_id);

    // Splice out of the array
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.status(201).json({
      message: "success",
      profile,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Delete user and profile
exports.deleteUserAndProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndRemove({ user: req.userId });

    const user = await User.findOneAndRemove({ user: req.userId });

    res.status(201).json({ message: "success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
  next(err);
};
