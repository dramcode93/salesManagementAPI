import expressAsyncHandler from 'express-async-handler';
import { deleteOne, updateOne, getAll, createOne, findOne } from '../controllers/refactorHandler.js'
import billModel from '../Models/billsModel.js'
import productsModel from '../Models/productsModel.js';




//  create Bills post 
export const createBills = expressAsyncHandler(async (req, res) => {

    const productQuantityMap = req.body.productQuantityMap || {};
    const products = req.body.products
    const productDetailsPromises = products.map(async (productData) => {
        const productId = productData.product;
        const requestedQuantity = productQuantityMap[productId] || 0;

        // Check if the product exists in DB
        const product = await productsModel.findById(productId);
        if (!product) {
            return Promise.reject(new Error(`Product not found for ID: ${productId}`));
        }

        // Check for the quantity of products
        if (requestedQuantity <= 0 || requestedQuantity > product.quantity) {
            return Promise.reject(new Error(`Invalid quantity for product: ${product.name}`));
        }

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
export const updateBills = updateOne(billModel)
//delete Bills using id with find by id delete m delete
export const deleteBills = deleteOne(billModel)

