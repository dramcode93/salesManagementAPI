import productModel from '../Models/productsModel.js'
import { deleteOne, updateOne, getAll, createOne, findOne } from '../controllers/refactorHandler.js'



export const addSubProductNest = (req, res, next) => {
    //  nest route if not send catId with name of product
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
}

// middleWare to create product if not write catId
export const allProductCat = (req, res, next) => {
    // nest route  (product &category)
    //  get   /api/category/:categoryId/product
    let filterData = {};
    if (req.params.categoryId) { filterData = { category: req.params.categoryId } }
    req.filterData = filterData;
    next();
}

//  create Product post 
export const createProduct = createOne(productModel);

// view list Product get 
export const AllProduct = getAll(productModel)
// find Product with id get
export const ProductId = findOne(productModel)

// update Product with id put
export const updateProduct = updateOne(productModel)
//delete Product using id with find by id delete m delete
export const deleteProduct = deleteOne(productModel)

