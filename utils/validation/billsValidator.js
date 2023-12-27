import { check } from "express-validator";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";

export const createBillsValidator = [
    check('customerName')
        .notEmpty().withMessage("Customer Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("phone")
        .optional()
        .isMobilePhone("ar-EG").withMessage("InValid Phone Number only accept EG Number "),
    check("products")
        .notEmpty().withMessage("Products are required")
        .isArray().withMessage("Products must be an array"),
    validatorMiddleware,
];

export const getBillsValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const updateBillValidator = [
    check("id")
        .isMongoId().withMessage("Invalid Id"),
    check('customerName')
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage("Name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("phone")
        .optional()
        .isMobilePhone("ar-EG").withMessage("InValid Phone Number only accept EG Number "),
    check("products")
        .optional()
        .isArray().withMessage("Products must be an array"),
    validatorMiddleware,
];

export const deleteBillValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];