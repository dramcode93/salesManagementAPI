import { check } from "express-validator";
import slugify from "slugify";
import productModel from '../../Models/productsModel.js'
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
        .notEmpty().withMessage("products is required")
        .isMongoId().withMessage("Invalid Id")
        .custom((productIds) =>
            productModel.find({ _id: { $exists: true, $in: productIds } }).then((products) => {
                if (products.length < 1 || products.length != productIds.length) { return Promise.reject(new Error("No products for this Id")); }
            })
        ),
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
        .isMongoId().withMessage("Invalid Id")
        .custom((productIds) =>
            productModel.find({ _id: { $exists: true, $in: productIds } }).then((products) => {
                if (products.length < 1 || products.length != productIds.length) { return Promise.reject(new Error("No products for this Id")); }
            })
        ),
    validatorMiddleware,
];

export const deleteBillValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];