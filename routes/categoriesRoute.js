import { Router } from "express";
import productsRouter from './productsRoute.js'

const router = new Router();
router.use('/:categoryId/products', productsRouter)

router.route('/')
    .get()
    .post()

router.route('/:_id')
    .get()
    .put()
    .delete()

export default router