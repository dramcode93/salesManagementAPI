import { check } from "express-validator";
import productModel from '../../Models/productsModel.js'
import { validatroMiddleware } from "../../middlewares/validatorMiddleware.js";

export const createBillsValidator = [
    check('customerName')
        .notEmpty().withMessage("Customer Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name length must be between 2 and 50"),
    check("phone")
        .notEmpty().withMessage("Phone is Required")
        .isNumeric().withMessage("phone must be a number")
        .isMobilePhone("ar-EG")
        .withMessage("InValid Phone Number only accept EG Number "),
    check("products")
        .notEmpty()
        .withMessage("products is required")
        .isMongoId()
        .withMessage("Invalid Id")
        .custom((productId) =>
            productModel.findById(productId).then((products) => {
                if (!products) {
                    return Promise.reject(new Error("No products for this Id"));
                }
            })
        ),
    validatroMiddleware,
];
export const getBillsValidator = [
    check('billId').isMongoId().withMessage("Invalid Id"),
    validatroMiddleware,
];

export const updateBillValidator = [
    check("billId")
        .isMongoId()
        .withMessage("Invalid Id"),
    validatroMiddleware,
];

export const deleteBillValidator = [
    check('billId').isMongoId().withMessage("Invalid Id"),
    validatroMiddleware,
];