import { check } from "express-validator";
import { validatroMiddleware } from "../../middlewares/validatorMiddleware.js";
import categoryModel from "../../Models/categoryModel.js";
export const createProductValidator = [
    check("name")
        .notEmpty().withMessage("Product Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("name length must be between 2 and 50"),
    check("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Quantity must be a number")
        .toInt(),
    check("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("price must be a number"),
    check("category")
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Invalid Id")
        .optional()
        .custom((categoryId) =>
            categoryModel.findById(categoryId).then((category) => {
                if (!category) {
                    return Promise.reject(new Error("No category for this Id"));
                }
            })
        ),
    validatroMiddleware,
];

export const getProductValidator = [
    check('productId').isMongoId().withMessage("Invalid Id"),
    validatroMiddleware,
];

export const updateProductValidator = [
    check("productId")
        .isMongoId()
        .withMessage("Invalid Id"),
    validatroMiddleware,
];

export const deleteProductValidator = [
    check('productId').isMongoId().withMessage("Invalid Id"),
    validatroMiddleware,
];