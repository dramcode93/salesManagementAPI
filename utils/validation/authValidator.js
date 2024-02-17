import { body, check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";

export const loginValidator = [
    check('name')
        .notEmpty().withMessage('name is Required'),
    check("password")
        .notEmpty().withMessage('password is required')
        .isLength({ min: 6, max: 14 }).withMessage('Password should be between 6 and 14'),
    validatorMiddleware,
];

export const resetPasswordValidator = [
    body("confirmNewPassword")
        .notEmpty().withMessage("You Must Enter New Password Confirmation")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char"),
    body("newPassword")
        .notEmpty().withMessage("You Must Enter New Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char")
        .custom(async (val, { req }) => {
            if (val != req.body.confirmNewPassword) { throw new Error("Passwords do not match"); }
            return true;
        }),
    validatorMiddleware,
];