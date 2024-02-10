import asyncHandler from 'express-async-handler';
import { APIerrors } from '../utils/errors.js';
import ApiFeature from '../utils/apiFeature.js';
import { sanitizeUser } from '../utils/sanitization.js';


export const deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const DocumentDelete = await Model.findByIdAndDelete(req.params.id)
    if (!DocumentDelete) {
        return next(new APIerrors(`No item for this id ${req.params.id}`, 404));
    }
    res.status(204).json({ status: "success" });
})

export const updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!document) {
            return next(
                new APIerrors(`No document for this id ${req.params.id}`, 404)
            );
        }
        console.log(document);
        res.status(200).json({ data: document });
    });

export const findOne = (Model, modelName) => asyncHandler(async (req, res, next) => {
    const one = await Model.findById(req.params.id)
    if (!one) {
        return next(new APIerrors(`No item for this id `, 404));
    }
    if (modelName == 'userModel') { res.status(200).json({ data: sanitizeUser(one) }) } else { res.status(200).json({ data: one }) }
})

export const createOne = (Model) => asyncHandler(async (req, res) => {

    const ct = await Model.create(req.body)
    res.status(200).json({ data: ct })
})


export const getAll = (Model, modelName) => asyncHandler(async (req, res) => {
    let filterData = {};
    let searchLength = 0;
    if (req.filterData) { filterData = req.filterData }
    if (req.query.search) {
        const searchResult = new ApiFeature(Model.find(filterData), req.query).search(modelName);
        const searchData = await searchResult.mongooseQuery;
        searchLength = searchData.length;
    }
    const documentCount = searchLength || await Model.countDocuments();
    const apiFeature = new ApiFeature(Model.find(filterData), req.query).filter().sort().limitFields().search(modelName).pagination(documentCount)

    //execute query
    const { mongooseQuery, paginationResult } = apiFeature;
    const proList = await mongooseQuery;
    res.json({ results: proList.length, paginationResult, data: proList });
})

export const getAllList = (Model) => asyncHandler(async (req, res) => {
    let filterData = {};
    if (req.filterData) { filterData = req.filterData }
    const apiFeature = new ApiFeature(Model.find(filterData), req.query).sort()

    //execute query
    const { mongooseQuery } = apiFeature;
    const proList = await mongooseQuery;
    res.json({ results: proList.length, data: proList });
})