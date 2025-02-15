import { Router } from "express";
import { createBills, AllBills, BillsId, updateBills, deleteBills, selectBills } from '../controllers/bills.js'
import { createBillsValidator, deleteBillValidator, getBillsValidator, updateBillValidator } from '../utils/validation/billsValidator.js';
import { allowedTo, checkActive, protectRoutes } from '../controllers/auth.js';
const router = new Router();

router.use(protectRoutes)
router.use(checkActive)

router.route('/')
    .get(allowedTo('admin', 'user'), selectBills, AllBills)
    .post(allowedTo('admin', 'user'), createBillsValidator, createBills)

router.use(allowedTo('admin'))

router.route('/:id')
    .get(getBillsValidator, BillsId)
    .put(updateBillValidator, updateBills)
    .delete(deleteBillValidator, deleteBills)

router.get('/:id/userBills', selectBills, AllBills)

export default router
