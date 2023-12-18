import billModel from '../Models/billsModel.js'
import { deleteOne, updateOne, getAll, createOne, findOne } from '../controllers/refactorHandler.js'




//  creat Bills post 
export const createBills = createOne(billModel);

// view list Bills get 
export const AllBills = getAll(billModel, "billModel")
// find bill with id get
export const BillsId = findOne(billModel)

// update Bills with id put
export const updateBills = updateOne(billModel)
//delete Bills using id with find by id delete m delete
export const deleteBills = deleteOne(billModel)

