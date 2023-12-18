import { allProductCat, addsubProductNest, createProduct, AllProduct, ProductId, updateProduct, deleteProduct } from '../controllers/product.js'
import { Router } from "express";
const router = new Router({ mergeParams: true });

router.route('/')
    .get(allProductCat, AllProduct)
    .post(addsubProductNest, createProduct)

router.route('/:id')
    .get(ProductId)
    .put(updateProduct)
    .delete(deleteProduct)

export default router
