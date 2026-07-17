import { asyncHandler } from '../utils/asyncHandler.js';
import { getData, 
    deleteData, 
    createData,
    getDataByID,
    updateData, 
    byUserName} from '../services/ProductLogic.js';
import { ObjectId } from 'mongodb';

const allowedSortFields = new Set([
    "price",
    "name",
    "createdAt",
    "updatedAt"
]);

export const getAllProducts = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 100,
        random = false,
        sort,
        order = "asc",
        ...filters
    } = req.query;

    if (sort && !allowedSortFields.has(sort)) {
        return res.status(400).json({message:`Sorting by "${sort}" is not supported.`})
    }
    const data = await getData({
        page: Number(page)||1,
        limit: Number(limit)||10,
        random: random === "true",
        sort,
        order,
        filters
    });
    return res.status(200).json(data);
});
export const getRandomProducts = asyncHandler(async (req, res) => {
    let limit = Number(req.params.limit ?? 10) 

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({
            message: "Limit must be between 1 and 100."
        });
    }

    const data = await getData({page:1,limit,random:true,sort:false,order:"asc",filters:{}});
    return res.status(200).json(data);
});

export const getProductByID = asyncHandler(async (req, res)=>
{
    const {id} = req.params
    if(!ObjectId.isValid(id))
    {
        return res.status(400).json({message:"Invalid product ID."})
    }
    const data =  await getDataByID(id,req.user.username);
    if (!data) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(data);
})


export const createProduct = asyncHandler(async (req, res) => {
    const data = await createData(req.verifiedProduct);
    return res.status(201).json({message:"Product created successfully.",data});
});

export const deleteProduct = asyncHandler(async (req, res) => {
    let { id } = req.params;
    if(!ObjectId.isValid(id))
    {
        return res.status(400).json({message:"Invalid product ID."})
    }
    const data = await deleteData({_id: id,owner: req.user.username})
    if(!data)
    {
        return res.status(404).json({message:"Product not found."})
    }
    return res.status(200).json({message:"Product deleted successfully.",data});
});

export const patchData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!ObjectId.isValid(id))
        return res.status(400).json({message:"Invalid product ID."})
    const update  = req.verifiedProduct;
    const data = await updateData(
        { 
            _id: id,
            owner: req.user.username
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

export const getProductByUsername = asyncHandler(async(req,res)=>{
    const {username} = req.params
    if(username.toUpperCase() === "MATRUNI" )
    {
        return res.status(200).json({message:"Full access available. Fetch all products using the GET endpoint."});
    }
    const data = await byUserName(username);
    if(!data || data.length === 0)
    {
        return res.status(404).json({message:"No product found."})
    }
    return res.status(200).json(data)
})