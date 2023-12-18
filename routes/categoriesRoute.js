import { createCategory, AllCategory, categoryId, updateCategory, deleteCategory } from '../controllers/category.js'
import { Router } from "express";
import productsRouter from './productsRoute.js'

const router = new Router();
router.use('/:categoryId/products', productsRouter)

router.route('/')
    .get(AllCategory)
    .post(createCategory)

router.route('/:id')
    .get(categoryId)
    .put(updateCategory)
    .delete(deleteCategory)

export default router