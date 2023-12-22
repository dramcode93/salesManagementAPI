import { createCategory, AllCategory, categoryId, updateCategory, deleteCategory } from '../controllers/category.js'
import { Router } from "express";
import productsRouter from './productsRoute.js'
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from '../utils/validation/categoryValidator.js';

const router = new Router();
router.use('/:categoryId/products', productsRouter)

router.route('/')
    .get(AllCategory)
    .post(createCategoryValidator, createCategory)

router.route('/:id')
    .get(getCategoryValidator, categoryId)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)

export default router