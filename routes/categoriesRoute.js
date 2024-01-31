import { Router } from "express";
import productsRouter from './productsRoute.js'
import { createCategory, AllCategory, categoryId, updateCategory, deleteCategory, AllCategoryList } from '../controllers/category.js'
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from '../utils/validation/categoryValidator.js';
import { protectRoutes } from '../controllers/auth.js';

const router = new Router();
router.use('/:categoryId/products', productsRouter)
router.use(protectRoutes)

router.route('/')
    .get(AllCategory)
    .post(createCategoryValidator, createCategory)

router.get('/list', AllCategoryList)

router.route('/:id')
    .get(getCategoryValidator, categoryId)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)

export default router