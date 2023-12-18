import asyncHandler from 'express-async-handler';
import {APIerrors} from '../utils/errors.js';
import ApiFeature from '../utils/apiFeature.js';


export const deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const DocumentDelete = await Model.findByIdAndDelete(req.params.id)
    if (!DocumentDelete) {
        return next(new APIerrors(`error on id ${id}`, 404));
    }
    res.json({ data: DocumentDelete });
    next();
})

export const updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        console.log(req.body)
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!document) {
            return next(
                new APIerrors(`No document for this id ${req.params.id}`, 404)
            );
        }
        res.status(200).json({ data: document });
    });

export const findOne = (Model) => asyncHandler(async (req, res, next) => {
    const one = await Model.findById(req.params.id)
    if (!one) {
        return next(new APIerrors(`error on id`, 404));
    }
    res.status(200).json({data: one })
})

export const createOne = (Model) => asyncHandler(async (req, res) => {

    const ct = await Model.create(req.body)
    res.status(200).json({ data: ct })
})


export const getAll = (Model, modelName) => asyncHandler(async (req, res) => {
    const documenCount = await Model.countDocuments();
    const apiFeature = new ApiFeature(Model.find(), req.query).pagenation(documenCount).filter().sort().limitFields().search(modelName)

    //execute query
    const { moongoseQuery, pagenationResult } = apiFeature;
    const proList = await moongoseQuery;
    res.json({ results: proList.length, pagenationResult, data: proList });
})