import expressAsyncHandler from 'express-async-handler';
import { deleteOne, getAll, findOne } from '../controllers/refactorHandler.js'
import billModel from '../Models/billsModel.js'
import productsModel from '../Models/productsModel.js';

//  create Bills post 
export const createBills = expressAsyncHandler(async (req, res, next) => {

    const productQuantityMap = req.body.productQuantityMap || {};
    const products = req.body.products
    const productDetailsPromises = products.map(async (productData) => {
        const productId = productData.product;
        const requestedQuantity = productQuantityMap[productId] || 0;

        // Get product
        const product = await productsModel.findById(productId);

        // Update the product quantity in the database
        await productsModel.findByIdAndUpdate(productId, {
            $inc: {
                quantity: -requestedQuantity,
                sold: requestedQuantity
            }
        });

        return {
            product: productData.product,
            productQuantity: requestedQuantity,
            totalPrice: product.price * requestedQuantity,
        };
    });
    const productDetails = await Promise.all(productDetailsPromises);

    req.body.products = productDetails; // Update req.body.products with detailed information

    const bill = await billModel.create(req.body)
    res.status(200).json({ data: bill })
});

// view list Bills get 
export const AllBills = getAll(billModel, "billModel")
// find bill with id get
export const BillsId = findOne(billModel)

// update Bills with id put
export const updateBills = expressAsyncHandler(async (req, res) => {

    const productQuantityMap = req.body.productQuantityMap || {};
    const products = req.body.products
    if (products) {
        const bill = await billModel.findById(req.params.id);

        // Check if product in bill sent in body or no
        const arrayOfValues = products.map(obj => Object.values(obj));
        const flattenedValues = arrayOfValues.flat();
        bill.products.forEach(async (checkProduct) => {
            if (!(flattenedValues.includes(checkProduct.product._id.toString()))) {
                const updateFields = {
                    quantity: checkProduct.productQuantity,
                    sold: -checkProduct.productQuantity,
                }
                await productsModel.findByIdAndUpdate(checkProduct.product._id, { $inc: updateFields });
            }
        });

        // update bill
        const productDetailsPromises = products.map(async (productData) => {
            const productId = productData.product;
            const requestedQuantity = productQuantityMap[productId] || 0;

            // Get product
            const product = await productsModel.findById(productId);

            // update products quantity
            let quantityDifference;
            const existingProduct = bill.products.find((billProduct) => billProduct.product._id.toString() === productId.toString());
            if (existingProduct) { quantityDifference = -(existingProduct.productQuantity - requestedQuantity); }
            else { quantityDifference = requestedQuantity }
            const updateFields = {
                quantity: - quantityDifference,
                sold: quantityDifference,
            };
            await productsModel.findByIdAndUpdate(productId, { $inc: updateFields });
            return {
                product: productData.product,
                productQuantity: requestedQuantity,
                totalPrice: product.price * requestedQuantity,
            };
        });
        const productDetails = await Promise.all(productDetailsPromises);

        req.body.products = productDetails; // Update req.body.products with detailed information
    }
    const updatedBill = await billModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({ data: updatedBill })
});

//delete Bills using id with find by id delete m delete
export const deleteBills = deleteOne(billModel)