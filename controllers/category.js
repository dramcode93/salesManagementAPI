import categoryModel from '../Models/categoryModel.js';
import { deleteOne, updateOne, getAll, createOne, findOne } from '../controllers/refactorHandler.js'

//  create category post 
export const createCategory = createOne(categoryModel);

// view list category get 
export const AllCategory = getAll(categoryModel,"categoryModel")
// find category with id get
export const categoryId = findOne(categoryModel)

// update category with id put
export const updateCategory = updateOne(categoryModel)
//delete category using id with find by id delete m delete
export const deleteCategory = deleteOne(categoryModel)

