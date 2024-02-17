import userModel from '../Models/usersModel.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'
import { findOne, getAll } from '../controllers/refactorHandler.js'
import { APIerrors } from '../utils/errors.js';
import { createToken } from '../utils/createToken.js';
import { sanitizeUser } from '../utils/sanitization.js';

export const getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})

// get specific users of one admin
export const adminUsers = (req, res, next) => {
    let filterData = {};
    if (req.user.role == 'admin') { filterData = { adminUser: req.user._id } }
    req.filterData = filterData;
    next();
}

// find user with id get private
export const userId = findOne(userModel, 'userModel')


export const updateLoggedUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email,
    }, { new: true, });
    if (!user) { return next(new APIerrors(`No user for this id ${req.params.id}`, 404)); }
    res.status(200).json({ message: 'your Data updated successfully', data: sanitizeUser(user) });
});

export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now()
    }, { new: true, });
    if (!user) { return next(new APIerrors(`No user for this id ${req.params.id}`, 404)); }
    const token = createToken(user._id);
    res.status(200).json({ message: 'your password updated successfully', data: sanitizeUser(user), token });
});

// view list user get  private
export const userList = getAll(userModel, 'userModel')

//  create user post  private
export const createUser = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    let createdUser;
    if (user.role == 'admin') {
        const newUser = {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email || undefined,
            password: req.body.password,
            adminUser: req.user._id
        };
        createdUser = await userModel.create(newUser)
        user.users.push(createdUser._id);
        console.log(user.users);
        await user.save({ validateBeforeSave: false });
    } else { createdUser = await userModel.create(req.body) }
    res.status(201).json({ data: sanitizeUser(createdUser) });
})

// update user with id put  private
export const updateUser = asyncHandler(async (req, res, next) => {
    const document = await userModel.findByIdAndUpdate(req.params.id, {
        name: req.body?.name,
        slug: req.body?.slug,
        email: req.body?.email,
        active: req.body?.active
    }, { new: true, });
    if (!document) { return next(new APIerrors(`No document for this id ${req.params.id}`, 404)); }
    res.status(200).json({ data: sanitizeUser(document) });
});

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