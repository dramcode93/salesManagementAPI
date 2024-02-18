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
        await user.save({ validateBeforeSave: false });
    } else { createdUser = await userModel.create(req.body) }
    res.status(201).json({ data: sanitizeUser(createdUser) });
})

// update user with id put  private
export const updateUser = asyncHandler(async (req, res, next) => {
    const document = await userModel.findById(req.params.id);
    if (!document) { return next(new APIerrors(`No document for this id ${req.params.id}`, 404)); }
    if (req.user.role == 'admin' && req.user._id.toString() != document.adminUser.toString()) { return next(new APIerrors("You can only change your own users"), 400); }
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
        name: req.body?.name,
        slug: req.body?.slug,
        email: req.body?.email,
        active: req.body?.active
    }, { new: true, });
    if (req.user.role == 'manager' && updatedUser.role == 'admin') {
        if (req.body.active) {
            const adminUsers = await userModel.find({ adminUser: updatedUser._id });
            if (adminUsers) {
                const updatePromises = adminUsers.map(async (user) => { await userModel.findByIdAndUpdate(user._id, { active: req.body.active }, { new: true }); });
                await Promise.all(updatePromises);
            }
        }
    }
    res.status(200).json({ data: sanitizeUser(updatedUser) });
});

// update user password
export const changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await userModel.findById(req.params.id);
    if (!document) { return next(new APIerrors(`No document for this id ${req.params.id}`, 404)); }
    if (req.user.role == 'admin' && req.user._id.toString() != document.adminUser.toString()) { return next(new APIerrors("You can only change your own users"), 400); }
    document.password = await bcrypt.hash(req.body.password, 12);
    document.passwordChangedAt = Date.now();
    await document.save({ validateBeforeSave: false });
    res.status(200).json({ data: sanitizeUser(document) });
});

//delete user using id with find by id delete m delete
export const deleteUser = asyncHandler(async (req, res, next) => {
    const DocumentDelete = await userModel.findById(req.params.id)
    if (!DocumentDelete) { return next(new APIerrors(`No item for this id ${req.params.id}`, 404)); }
    if (req.user.role == 'admin' && req.user._id.toString() != DocumentDelete.adminUser.toString()) { return next(new APIerrors("You can only delete your own users"), 400); }
    else if (req.user.role == 'manager' && DocumentDelete.role == 'manager' && timeCreatedUser(req.user) > timeCreatedUser(DocumentDelete)) {
        return next(new APIerrors('You can not delete this manager', 400));
    }
    if (req.user.role == 'manager' && DocumentDelete.role == 'admin') {
        const adminUsers = await userModel.find({ adminUser: DocumentDelete._id });
        if (adminUsers) {
            const deletePromises = adminUsers.map(async (user) => { await userModel.findByIdAndDelete(user._id); });
            await Promise.all(deletePromises);
        }
    }
    await userModel.deleteOne({ _id: req.params.id })
    res.status(204).json({ status: "success Deleting" });
})

const timeCreatedUser = (user) => { return parseInt(user.createdAt.getTime() / 1000, 10) }