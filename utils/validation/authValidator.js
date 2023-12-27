import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";

export const loginValidator = [
    check('email')
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Invalid email'),
    check("password")
        .notEmpty().withMessage('password is required')
        .isLength({ min: 6, max: 14 }).withMessage('Password should be between 6 and 14'),
    validatorMiddleware,
];