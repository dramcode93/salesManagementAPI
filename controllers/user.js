import userModel from '../Models/usersModel.js';
import asyncHandler from 'express-async-handler';
import { deleteOne, getAll, createOne, findOne } from '../controllers/refactorHandler.js'
import bcrypt from 'bcryptjs'

//  creat user post  private
export const creatUser = createOne(userModel)

// view list user get  private
export const userList = getAll(userModel)

// find user with id get private
export const userId = findOne(userModel)

// update user with id put  private
export const updateUser = asyncHandler(async (req, res, next) => {

    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});


export const changeUserPassword = asyncHandler(async (req, res, next) => {

    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12)
            , passwordChangedAt: Date.now()
        },
        {
            new: true,
        }
    );
        
    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

//delete user using id with find by id delete m delete
export const deleteUser = deleteOne(userModel)

