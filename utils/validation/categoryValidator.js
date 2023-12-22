import { check } from "express-validator";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import productsModel from "../../Models/productsModel.js";

export const createCategoryValidator = [
    check('name')
        .notEmpty().withMessage("Category Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

export const getCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const updateCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    check('name')
        .notEmpty().withMessage("Category Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

export const deleteCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Id")
        .custom(async (value) => {
            const products = await productsModel.find({ category: value })
            if (products) {
                const deletePromises = products.map(async (product) => {
                    await productsModel.findByIdAndDelete(product._id);
                });
                await Promise.all(deletePromises);
            }
            return true;
        }),
    validatorMiddleware,
];