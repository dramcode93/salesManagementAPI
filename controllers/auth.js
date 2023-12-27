import expressAsyncHandler from "express-async-handler";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import createToken from '../utils/createToken.js'
import { APIerrors } from "../utils/errors.js";
import usersModel from "../Models/usersModel.js";


export const login = expressAsyncHandler(async (req, res, next) => {
    const user = await usersModel.findOne({ email: req.body.email })
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new APIerrors('Invalid email or password', 401))
    }
    const token = createToken(user._id)
    res.status(200).json({ user, token })
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
        const changedPasswordTime = parent(user.passwordChangedAt.getTime() / 1000, 10)
        if (changedPasswordTime > decoded.iat) { return next(APIerrors('Your password has been updated since you logged in last time. \nPlease log in again.', 403)) }
    }

    // Attach the user to the request object
    req.user = user;
    next();
})