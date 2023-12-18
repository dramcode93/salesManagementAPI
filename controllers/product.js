import productModel from '../Models/productsModel.js'
import { deleteOne, updateOne, getAll, createOne, findOne } from '../controllers/refactorHandler.js'



export const addsubProductNest = (req, res, next) => {
    //  nest route if not send catId with name of product
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
}

// middleWare to create product if not write catId
export const allProductCat = (req, res, next) => {
    // nest route  (product &category)
    //  get   /api/category/:categoryid/product
    var filterObject = {};
    if (req.params.categoryId) { filterObject = { category: req.params.categoryId } }
    req.filterObj = filterObject;
    next();
}

//  creat Product post 
export const createProduct = createOne(productModel);

// view list Product get 
export const AllProduct = getAll(productModel)
// find Product with id get
export const ProductId = findOne(productModel)

// update Product with id put
export const updateProduct = updateOne(productModel)
//delete Product using id with find by id delete m delete
export const deleteProduct = deleteOne(productModel)

