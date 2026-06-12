import { asyncHandler } from '../utils/asyncHandler.js';
import { getData, findOne, deleteData, createData } from '../services/ProductLogic.js';

export const getAllProducts = asyncHandler(async (req, res) => {
    const data = await getData(10);
    return res.status(200).json(data);
});

export const findSpecific = asyncHandler(async (req, res) => {
    let { field, type } = req.params;

    type = isNaN(type) ? type : Number(type);

    const data = await findOne(field, type);

    if (!data) {
        return res.status(404).json({ error: "Doesn't exist" });
    }

    return res.status(200).json(data);
});

export const createProduct = asyncHandler(async (req, res) => {
    const data = await createData(req.body);
    return res.status(201).json(data);
});

export const deleteProduct = asyncHandler(async (req, res) => {
    let { field, type, isOne } = req.params;

    type = isNaN(type) ? type : Number(type);

    isOne = (isOne === 'true' || isOne === undefined);

    const data = await deleteData(field, type, isOne);

    return res.status(200).json(data);
});