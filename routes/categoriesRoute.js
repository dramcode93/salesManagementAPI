import { Router } from "express";
import productsRouter from './productsRoute.js'
import { createCategory, AllCategory, categoryId, updateCategory, deleteCategory, AllCategoryList } from '../controllers/category.js'
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from '../utils/validation/categoryValidator.js';
import { allowedTo, checkActive, protectRoutes } from '../controllers/auth.js';

const router = new Router();
router.use('/:categoryId/products', productsRouter)
router.use(protectRoutes)
router.use(checkActive)

router.route('/')
    .get(allowedTo('admin', 'user'), AllCategory)
    .post(allowedTo('admin'), createCategoryValidator, createCategory)

router.get('/list', allowedTo('admin', 'user'), AllCategoryList)

router.use(allowedTo('admin'))

router.route('/:id')
    .get(getCategoryValidator, categoryId)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)

export default router