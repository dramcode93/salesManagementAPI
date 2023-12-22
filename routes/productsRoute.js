import { allProductCat, addSubProductNest, createProduct, AllProduct, ProductId, updateProduct, deleteProduct } from '../controllers/product.js'
import { Router } from "express";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from '../utils/validation/productValidator.js';
const router = new Router({ mergeParams: true });

router.route('/')
    .get(allProductCat, AllProduct)
    .post(addSubProductNest, createProductValidator, createProduct)

router.route('/:id')
    .get(getProductValidator, ProductId)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct)

export default router
