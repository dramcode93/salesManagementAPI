import { Router } from "express";
import { allProductCat, addSubProductNest, createProduct, AllProduct, ProductId, updateProduct, deleteProduct, AllProductList } from '../controllers/product.js'
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from '../utils/validation/productValidator.js';
import { allowedTo, checkActive, protectRoutes } from '../controllers/auth.js';

const router = new Router({ mergeParams: true });
router.use(protectRoutes)
router.use(checkActive)


router.route('/')
    .get(allowedTo('admin', 'user'), allProductCat, AllProduct)
    .post(allowedTo('admin'), addSubProductNest, createProductValidator, createProduct)

router.get('/list', allowedTo('admin', 'user'), allProductCat, AllProductList)

router.use(allowedTo('admin'))

router.route('/:id')
    .get(getProductValidator, ProductId)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct)

export default router
