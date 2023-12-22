import { check } from "express-validator";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import categoryModel from "../../Models/categoryModel.js";
export const createProductValidator = [
    check("name")
        .notEmpty().withMessage("Product Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("quantity")
        .optional()
        .isNumeric().withMessage("Quantity must be a number")
        .toInt(),
    check("price")
        .notEmpty().withMessage("Product price is required")
        .isNumeric().withMessage("price must be a number"),
    check("category")
        .notEmpty().withMessage("Category is required")
        .isMongoId().withMessage("Invalid Id")
        .custom((categoryId) =>
            categoryModel.findById(categoryId).then((category) => {
                if (!category) { return Promise.reject(new Error("No category for this Id")); }
            })
        ),
    validatorMiddleware,
];

export const getProductValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const updateProductValidator = [
    check("id")
        .isMongoId().withMessage("Invalid Id"),
    check("name")
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("quantity")
        .optional()
        .isNumeric().withMessage("Quantity must be a number")
        .toInt(),
    check("price")
        .optional()
        .isNumeric().withMessage("price must be a number"),
    check("category")
        .optional()
        .isMongoId().withMessage("Invalid Id")
        .custom((categoryId) =>
            categoryModel.findById(categoryId).then((category) => {
                if (!category) { return Promise.reject(new Error("No category for this Id")); }
            })
        ),
    validatorMiddleware,
];

export const deleteProductValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];