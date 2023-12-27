import { Router } from "express";
import { createBills, AllBills, BillsId, updateBills, deleteBills } from '../controllers/bills.js'
import { createBillsValidator, deleteBillValidator, getBillsValidator, updateBillValidator } from '../utils/validation/billsValidator.js';
import { protectRoutes } from '../controllers/auth.js';
const router = new Router();

router.use(protectRoutes)

router.route('/')
    .get(AllBills)
    .post(createBillsValidator, createBills)

router.route('/:id')
    .get(getBillsValidator, BillsId)
    .put(updateBillValidator, updateBills)
    .delete(deleteBillValidator, deleteBills)
export default router
