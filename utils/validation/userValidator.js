import { check, body } from "express-validator";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import userModel from '../../models/userModel.js';

export const getUserValidator = [
    check("id").isMongoId().withMessage("invalid user id"),
    validatorMiddleware,
];
export const createUserValidator = [
    check("name")
        .notEmpty().withMessage(" User Name is Required")
        .isLength({ min: 2, max: 50 }).withMessage("Name should be 2 : 50 char ")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .notEmpty().withMessage("Email is Required")
        .isEmail().withMessage("InValid Email Address")
        .custom((val) =>
            userModel.findOne({ email: val }).then((userModel) => {
                if (userModel) { return Promise.reject(new Error("Email already in user")); }
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
    validatorMiddleware,
];

export const changeUserPasswordValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    body("currentPassword")
        .notEmpty().withMessage(" You Must Enter Your current Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password must be at least 6 char and at most 14 char"),
    body("passwordConfirmation")
        .notEmpty().withMessage("You Must Enter Password Confirm")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char"),
    body("password")
        .notEmpty().withMessage("You Must Enter New Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char")
        .custom(async (val, { req }) => {
            const user = await userModel.findById(req.params.id);
            if (!user) { throw new Error("there is No User For This Id"); }
            const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isCorrectPassword) { throw new Error("InCorrect Current Password"); }
            if (val != req.body.passwordConfirmation) { throw new Error("Passwords do not match"); }
            return true;
        }),
    validatorMiddleware,
];
export const deleteUserValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];
