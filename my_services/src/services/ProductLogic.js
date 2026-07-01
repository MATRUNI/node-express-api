import PRODUCT from "../models/PRODUCTS.js";
import { getCachedProducts } from "../cache/productsCache.js";
import { getRandomProduct } from "../utils/getRandomProduct.js";
import { ObjectId } from "mongodb";

export const getData = async(limit)=>{
    
    const cachedData = await getCachedProducts();

    const randomProducts = getRandomProduct(cachedData,limit);

    return randomProducts;
}
export const getAllData = async()=>{
    
    const cachedData = await getCachedProducts();

    return cachedData.slice(0,100);
}
export const getDataByID = async (id)=>
{
    return await PRODUCT.findById(id)
}
export const getPageData = async(start,end)=>{
    
    const cachedData = await getCachedProducts();

    return cachedData.slice(start,end);
}
export const findAll = async(field,value)=>{
    return await PRODUCT.find({[field]: value})
}
export const createData = async(productData)=>{
    if(!productData.name) 
    {
        throw new Error("Product Name missing")
    }
    return await PRODUCT.create({...productData});
}

export const deleteData = async(filter,deleteOne=true)=>{  // field->kay, value->value
    if(deleteOne)
    {
        return await PRODUCT.deleteOne(filter);
    }
    return await PRODUCT.deleteMany(filter)
}

export const updateData = async(filter, updateFields)=>{
    return await PRODUCT.updateOne(filter, {$set: updateFields})
}