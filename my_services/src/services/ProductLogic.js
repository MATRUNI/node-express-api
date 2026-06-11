import PRODUCT from "../models/PRODUCTS.js";
import { makeSKU, makeSlug } from "../utils/genericHelper.js";

export const getData = async(filter={})=>{
    return await PRODUCT.find(filter);
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