import { createBills, AllBills, BillsId, updateBills, deleteBills } from '../controllers/bills.js'

import { Router } from "express";
const router = new Router();


router.route('/')
    .get(AllBills)
    .post(createBills)

router.route('/:id')
    .get(BillsId)
    .put(updateBills)
    .delete(deleteBills)
export default router
