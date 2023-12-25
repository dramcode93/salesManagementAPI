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
        .custom(async (productIds, { req }) => {
            // Check if products exists in DB
            const products = await productModel.find({ _id: { $exists: true, $in: productIds } });
            if (products.length < 1 || products.length != productIds.length) { return Promise.reject(new Error("No products for this Id")); }

            // Check for the quantity of products
            const productQuantityMap = req.body.productQuantityMap || {};
            for (const product of products) {
                const productId = product._id.toString();
                const requestedQuantity = productQuantityMap[productId] || 0;
                if (requestedQuantity <= 0 || requestedQuantity > product.quantity) {
                    return Promise.reject(new Error(`Invalid quantity for product: ${product.name}`));
                }
            }
            // Update product quantities in the database
            await Promise.all(products.map(async (product) => {
                const productId = product._id.toString();
                const requestedQuantity = productQuantityMap[productId] || 0;

                // Update the product quantity in the database
                await productModel.findByIdAndUpdate(productId, {
                    $inc: {
                        quantity: -requestedQuantity,
                        sold: requestedQuantity
                    }
                });
            }));

            return true;
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