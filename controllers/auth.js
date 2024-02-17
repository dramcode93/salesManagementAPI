import crypto from 'crypto';
import expressAsyncHandler from "express-async-handler";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { createToken, createResetToken } from '../utils/createToken.js';
import sendEmail from "../utils/sendEmail.js";
import { APIerrors } from "../utils/errors.js";
import { sanitizeUser } from '../utils/sanitization.js';
import usersModel from "../Models/usersModel.js";


export const login = expressAsyncHandler(async (req, res, next) => {
    const user = await usersModel.findOne({ name: req.body.name })
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new APIerrors('Invalid username or password', 401))
    }
    const token = createToken(user._id)
    res.status(200).json({ user: sanitizeUser(user), token })
})

export const protectRoutes = expressAsyncHandler(async (req, res, next) => {

    // Check token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) { return next(new APIerrors('You are not logged in! Please log in to get access.', 401)); }

    // Verify token
    const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if user exist
    const user = await usersModel.findById(decoded._id);
    if (!user) { return next(new APIerrors('The user does not exist anymore...', 404)) }

    // Check if user change his password
    if (user.passwordChangedAt) {
        const changedPasswordTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10)
        if (changedPasswordTime > decoded.iat) { return next(new APIerrors('Your password has been updated since you logged in last time. Please log in again.', 403)) }
    }

    // Attach the user to the request object
    req.user = sanitizeUser(user);
    next();
})

// @desc permissions to access routes
export const allowedTo = (...roles) =>
    expressAsyncHandler(async (req, res, next) => {
        if (!(roles.includes(req.user.role))) { return next(new APIerrors(`Provilege denied! You cannot perform this action`, 403)) }
        next();
    })

export const checkActive = expressAsyncHandler(async (req, res, next) => {
    if (!req.user.active) { return next(new APIerrors("Your account is deactivated", 403)) }
    next()
})

export const forgetPassword = expressAsyncHandler(async (req, res, next) => {

    // Get the user by email
    const user = await usersModel.findOne({ email: req.body.email });
    if (!user) { return next(new APIerrors('No account with this email address exists.', 400)) }

    // Create a random reset code from 6 numbers
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // set the hashed reset code in user DB
    user.passwordResetCode = hashedResetCode;

    // set expire time for reset code
    user.passwordResetCodeExpires = Date.now() + (10 * 60 * 1000);
    user.passwordResetCodeVerify = false;

    // Save the updated Data
    await user.save({ validateBeforeSave: false })

    // Send the reset code to email
    const message = `مرحبا ${user.name}
    رمز التحقق الخاص بك هو ${resetCode}`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'تغيير كلمة المرور',
            message
        })
    } catch (err) {
        console.log(err);
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpires = undefined;
        user.passwordResetCodeVerify = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new APIerrors('Error while sending a password reset code... try again later'));
    }
    const resetToken = createResetToken(user._id);
    res.status(200).json({ success: true, resetToken, msg: 'check your email' });
})

export const verifyResetPasswordCode = expressAsyncHandler(async (req, res, next) => {
    let resetToken;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        resetToken = req.headers.authorization.split(' ')[1];
    }
    if (!resetToken) { return next(new APIerrors('You do not have permission to verify reset code.', 400)); }

    const decodedToken = Jwt.verify(resetToken, process.env.JWT_RESET_PASSWORD_SECRET_KEY)

    const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');

    const user = await usersModel.findOne({ _id: decodedToken._id, passwordResetCode: hashedResetCode, passwordResetCodeExpires: { $gt: Date.now() } });
    if (!user) { return next(new APIerrors('Invalid or expired reset code')) };
    user.passwordResetCodeVerify = true;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, resetToken, data: sanitizeUser(user) });
})

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
    let resetToken;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        resetToken = req.headers.authorization.split(' ')[1];
    }
    if (!resetToken) { return next(new APIerrors('You do not have permission to verify reset code.', 400)); }

    const decodedToken = Jwt.verify(resetToken, process.env.JWT_RESET_PASSWORD_SECRET_KEY)

    const user = await usersModel.findOne({ _id: decodedToken._id, passwordResetCodeVerify: true });
    if (!user) { return next(new APIerrors('Please verify your email first', 400)); }
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetCodeVerify = undefined;
    user.passwordChangedAt = Date.now();

    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: "Password has been changed" });
})