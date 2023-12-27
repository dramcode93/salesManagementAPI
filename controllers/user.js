import userModel from '../Models/usersModel.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'
import { findOne } from '../controllers/refactorHandler.js'
import { APIerrors } from '../utils/errors.js';
import { createToken } from '../utils/createToken.js';

export const getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})

// find user with id get private
export const userId = findOne(userModel)


export const updateLoggedUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email,
    }, { new: true, });
    if (!user) { return next(new APIerrors(`No user for this id ${req.params.id}`, 404)); }
    res.status(200).json({ message: 'your Data updated successfully', data: user });
});

export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now()
    }, { new: true, });
    if (!user) { return next(new APIerrors(`No user for this id ${req.params.id}`, 404)); }
    const token = createToken(user._id);
    res.status(200).json({ message: 'your password updated successfully', data: user, token });
});

// view list user get  private
// export const userList = getAll(userModel)

//  create user post  private
// export const createUser = createOne(userModel)

// update user with id put  private
// export const updateUser = asyncHandler(async (req, res, next) => {
//     const document = await userModel.findByIdAndUpdate(req.params.id, {
//         name: req.body.name,
//         email: req.body.email,
//     }, { new: true, });
//     if (!document) { return next(new APIerrors(`No document for this id ${req.params.id}`, 404)); }
//     res.status(200).json({ data: document });
// });

// update user password
// export const changeUserPassword = asyncHandler(async (req, res, next) => {
//     const document = await userModel.findByIdAndUpdate(req.params.id, {
//         password: await bcrypt.hash(req.body.password, 12)
//         , passwordChangedAt: Date.now()
//     }, { new: true, });
//     if (!document) { return next(new APIerrors(`No document for this id ${req.params.id}`, 404)); }
//     res.status(200).json({ data: document });
// });

//delete user using id with find by id delete m delete
// export const deleteUser = deleteOne(userModel)