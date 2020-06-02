const os = require('os');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const User = require('../../models/user');

// const { checkRefreshToken } = require("../../helpers/checkRefreshToken");
const { returnUser } = require('../../helpers/returnUser');
const { generateToken } = require("../../helpers/generateToken");
const { getUserIdToken } = require("../../helpers/getUserIdToken");

// const { completeSignupTemplatey } = require("../../util/mailler/templates/completeSignupTemplatey");
// const { resetPasswordTemplate } = require("../../util/mailler/templates/resetPasswordTemplate");
// const { resetPasswordTemplateMobile } = require("../../util/mailler/templates/resetPasswordTemplateMobile");
// const {passwordChangedSuccessful} = require("../../util/mailler/templates/passwordChangedSuccessful");

// const { sendMail } = require("../../util/mailler/sendMail");


exports.refreshToken = async(req, res, next) => {
    const errors = validationResult(req);
    const { token } = req.body;
    if (!errors.isEmpty()) {
        const error = new Error('Oops, something went wrong!');
        error.statusCode = 422;
        error.data = errors.array()[0].msg;
        throw error;
    }

    try {
        const userId = checkRefreshToken(token);

        let user = await User.findById(req.userId);

        if (!user) {
            throw new Error("User not found");
        }
        if (!userId) {
            throw new Error("In valid token");
        }

        res.status(201).json({
            success: true,
            token: generateToken(userId),
            user
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.signup = async(req, res, next) => {
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    try {

        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            error.data = errors.array()[0].msg;
            throw error;
        }

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({
                success: false,
                message: 'This email is in use by another user.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Account created successfully. Please check your email to get started.'
        });

        // Send a complete signup email to user mail box
        // sendMail(completeSignupTemplate(user, token));

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async(req, res, next) => {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const error = new Error('Oops, something went wrong!');
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
    }

    const {email, password} = req.body;

    try {
        const user = await returnUser(email);
        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }


        res.status(200).json({
            token: generateToken(user._id),
            user,
            message: 'Login successfully!',
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.forgotPassord = async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Oops, something went wrong!');
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
    }

    try {
        const { email } = req.body;

        const user = await returnUser(email);

        const token = generateToken(user._id);
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            await user.save();

            // Send a reset email to user mail box
            // sendMail(resetPasswordTemplate(user, token));

            res.status(200).json({
                success: true,
                message: `
                <h5>Forgot Password</h5>
                <p>You should soon receive an email allowing you to reset your password.</p>
                <p>Please make sure to check your spam and trash if you can't find the email.</p>
                `
            });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.resetPassword = async(req, res, next) => {
    try {
        const { password, passwordToken, userId } = req.body;

        const user = await User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: getUserIdToken(passwordToken)
        });


        if (!user) {
            const error = new Error('Invalid credencials.');
            error.statusCode = 401;
            error.data = 'Invalid credencials.';
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();

        const message = `<h3> Password reset successfully </h3>`;

        // Send a password changed email to user mail box
        // sendMail(passwordChangedSuccessful(user.email, message));

        res.status(200).json({
            success: true,
            message: 'Password reset successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};