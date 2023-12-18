import { check } from "express-validator";
import { validatroMiddleware } from "../../middlewares/validatorMiddleware.js";

export const createCategoryValidator = [
    check('name')
        .notEmpty().withMessage("Category Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name length must be between 2 and 50"),
    validatroMiddleware,
];

export const getCategoryValidator = [
    check('categoryId').isMongoId().withMessage("Invalid Id"),
    validatroMiddleware,
];

export const updateCategoryValidator = [
    check('categoryId').isMongoId().withMessage("Invalid Id"),
    validatroMiddleware,
];

export const deleteCategoryValidator = [
    check('categoryId').isMongoId().withMessage("Invalid Id"),
    validatroMiddleware,
];