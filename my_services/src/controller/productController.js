import { asyncHandler } from '../utils/asyncHandler.js';
import { getData, 
    findAll, 
    deleteData, 
    createData, 
    getAllData, 
    getPageData, 
    getDataByID,
    updateData } from '../services/ProductLogic.js';
import { ObjectId } from 'mongodb';


export const getAllProducts = asyncHandler(async (req, res) => {
    const data = await getAllData();
    return res.status(200).json(data);
});
export const getXRandomProducts = asyncHandler(async (req, res) => {
    let {limit} = req.params

    limit = parseInt(limit,10);

    if(limit>0 && limit<=100)
    {
        const data = await getData(limit);
        return res.status(200).json(data);
    }

    return res.status(400).json({message: "Limit must be between 1 and 100"})
});

export const getProductByID = asyncHandler(async (req, res)=>
{
    const {id} = req.params
    const data =  await getDataByID(id);
    if (!data) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(data);
})

export const getPageProducts = asyncHandler(async (req,res)=>
{
    let {number} = req.params
    number = parseInt(number, 10);

    if(number<1 || number > 5)
        return res.status(400).json({message: "Page number must be between 1 and 5"})

    const data = await getPageData((number-1)*100,number*100)

    return res.status(200).json({
        page:number,
        totalPages:5,
        count:100,
        message: "This data is paged from cache data and will change after sometime!", 
        products:data
    });
})
export const getTenRandomProducts = asyncHandler(async (req, res) => {
    const data = await getData(10);
    return res.status(200).json(data);
});

export const findSpecific = asyncHandler(async (req, res) => {
    let { field, type } = req.params;

    type = isNaN(type) ? type : Number(type);

    const data = await findAll(field, type);

    if (!data) {
        return res.status(404).json({ error: "Doesn't exist" });
    }

    return res.status(200).json(data);
});

export const createProduct = asyncHandler(async (req, res) => {
    const data = await createData(req.verifiedProduct);
    return res.status(201).json({message:"Date created successfully.",data});
});

export const deleteProduct = asyncHandler(async (req, res) => {
    let { field, type, deleteOne } = req.params;
    if (field === "id") {
        type = new ObjectId(type);
    }
    else
    type = isNaN(type) ? type : Number(type);

    let isSingleDelete = (deleteOne === 'true' || deleteOne === undefined);

    const data = await deleteData({[field]:type,createdBy:req.user.userId}, isSingleDelete);

    return res.status(200).json({data});
});

export const patchData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const update  = req.verifiedProduct;
    const data = await updateData(
        { 
            _id: id,
            createdBy: req.user.userId
        },
        update
    );

    if (!data) {
        return res.status(404).json({
            message: "Product not found or unauthorized access."
        });
    }

    return res.status(200).json({
        message: "Product updated successfully.",
        data,
    });
});