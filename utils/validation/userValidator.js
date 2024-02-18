import { check, body } from "express-validator";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import userModel from '../../Models/usersModel.js';

export const getUserValidator = [
    check("id").isMongoId().withMessage("invalid user id"),
    validatorMiddleware,
];

export const updateLoggedUserValidator = [
    check("name")
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage("Name should be 2 : 50 char ")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .optional()
        .isEmail().withMessage("InValid Email Address")
        .custom(async (val, { req }) => {
            await userModel.findOne({ email: val }).then((userModel) => {
                if (userModel && userModel._id.toString() != req.user._id) { return Promise.reject(new Error("Email already in user")); }
            })
        }),
    validatorMiddleware,
];

export const updateLoggedUserPasswordValidator = [
    body("currentPassword")
        .notEmpty().withMessage(" You Must Enter Your current Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password must be at least 6 char and at most 14 char"),
    body("confirmPassword")
        .notEmpty().withMessage("You Must Enter Password Confirm")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char"),
    body("password")
        .notEmpty().withMessage("You Must Enter New Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char")
        .custom(async (val, { req }) => {
            const user = await userModel.findById(req.user._id);
            if (!user) { throw new Error("there is No User For This Id"); }
            const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isCorrectPassword) { throw new Error("current Password is wrong"); }
            if (val != req.body.confirmPassword) { throw new Error("Passwords do not match"); }
            return true;
        }),
    validatorMiddleware,
];

export const createUserValidator = [
    check("name")
        .notEmpty().withMessage(" User Name is Required")
        .isLength({ min: 2, max: 50 }).withMessage("Name should be 2 : 50 char ")
        .custom((value) => userModel.findOne({ name: value }).then((user) => { if (user) { return Promise.reject(new Error("This username has already been taken")); } }))
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .optional()
        .isEmail().withMessage("InValid Email Address")
        .custom((val) =>
            userModel.findOne({ email: val }).then((userModel) => {
                if (userModel) { return Promise.reject(new Error("Email already in use")); }
            })
        ),
    check("password")
        .notEmpty().withMessage("Password Required")
        .isLength({ min: 6, max: 14 }).withMessage("Password must be at least 6 char and at most 14 char")
        .custom((password, { req }) => {
            if (password != req.body.passwordConfirmation) { throw new Error("Passwords do not match"); }
            return true;
        }),
    check("passwordConfirmation")
        .notEmpty().withMessage("Password Confirmation required")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char"),
    validatorMiddleware,
];
export const updateUserValidator = [
    check("id").isMongoId().withMessage("Invalid User Id"),
    check("name")
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage("Name should be 2 : 50 char ")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .optional()
        .isEmail().withMessage("InValid Email Address")
        .custom((val) =>
            userModel.findOne({ email: val }).then((userModel) => {
                if (userModel) { return Promise.reject(new Error("Email already in user")); }
            })
        ),
    check('active')
        .optional()
        .isBoolean().withMessage('Active field must be Boolean'),
    validatorMiddleware,
];

export const changeUserPasswordValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    body("passwordConfirmation")
        .notEmpty().withMessage("You Must Enter Password Confirm")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char"),
    body("password")
        .notEmpty().withMessage("You Must Enter New Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char")
        .custom(async (val, { req }) => {
            const user = await userModel.findById(req.params.id);
            if (!user) { throw new Error("there is No User For This Id"); }
            if (val != req.body.passwordConfirmation) { throw new Error("Passwords do not match"); }
            return true;
        }),
    validatorMiddleware,
];

export const deleteUserValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];
