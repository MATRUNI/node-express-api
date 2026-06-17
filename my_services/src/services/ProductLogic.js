import PRODUCT from "../models/PRODUCTS.js";
import { makeSKU, makeSlug } from "../utils/genericHelper.js";
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
export const findOne = async(field,value)=>{
    return await PRODUCT.findOne({[field]: value})
}
export const createData = async(productData)=>{
    if(!productData.name) 
    {
        throw new Error("Product Name missing")
    }
    const slug = makeSlug(productData.name);
    const sku = makeSKU();
    return await PRODUCT.create({...productData,sku,slug});
}

export const deleteData = async(field,value,multiple=false)=>{  // field->kay, value->value
    if(multiple)
    {
        return await PRODUCT.deleteMany({[field]: value})
    }
    return await PRODUCT.deleteOne({[field]: value});
}

export const updateData = async(filter, updateFields)=>{
    return await PRODUCT.updateOne(filter, {$set: updateFields})
}