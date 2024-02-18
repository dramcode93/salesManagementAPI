import categoryModel from '../Models/categoryModel.js';
import { deleteOne, updateOne, getAll, createOne, findOne, getAllList } from '../controllers/refactorHandler.js'

export const selectCategories = (req, res, next) => {
    let filterData = {};
    if (req.user.role == 'admin') { filterData = { adminUser: req.user._id } }
    else { filterData = { adminUser: req.user.adminUser } }
    req.filterData = filterData;
    next();
}

//  create category post 
export const createCategory = createOne(categoryModel);

// view list category get 
export const AllCategory = getAll(categoryModel, "categoryModel")

// view list category get 
export const AllCategoryList = getAllList(categoryModel)

// find category with id get
export const categoryId = findOne(categoryModel)

// update category with id put
export const updateCategory = updateOne(categoryModel)
//delete category using id with find by id delete m delete
export const deleteCategory = deleteOne(categoryModel)

