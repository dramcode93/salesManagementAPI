import { check } from "express-validator";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import productsModel from "../../Models/productsModel.js";

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
        .isArray().withMessage("Products must be an array")
        .custom(async (products, { req }) => {
            const productQuantityMap = req.body.productQuantityMap || {};
            await Promise.all(products.map(async (productData) => {
                const productId = productData.product;
                const requestedQuantity = productQuantityMap[productId] || 0;
                const product = await productsModel.findById(productId);
                if (!product) { throw new Error(`Product with id ${productId} not found`) };
                if (requestedQuantity <= 0 || requestedQuantity > product.quantity) { throw new Error(`Invalid quantity for product: ${product.name}`); }
            }))
        }),
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
        .isArray().withMessage("Products must be an array")
        .custom(async (products, { req }) => {
            const productQuantityMap = req.body.productQuantityMap || {};
            await Promise.all(products.map(async (productData) => {
                const productId = productData.product;
                const requestedQuantity = productQuantityMap[productId] || 0;
                const product = await productsModel.findById(productId);
                if (!product) { throw new Error(`Product with id ${productId} not found`) };
                if (requestedQuantity <= 0 || requestedQuantity > product.quantity) { throw new Error(`Invalid quantity for product: ${product.name}`); }
            }))
        }),
    validatorMiddleware,
];

export const deleteBillValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];