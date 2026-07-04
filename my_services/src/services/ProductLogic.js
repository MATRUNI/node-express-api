import PRODUCT from "../models/PRODUCTS.js";
import { getCachedProducts } from "../cache/productsCache.js";
import { getRandomProduct } from "../utils/getRandomProduct.js";
import SandboxProduct from "../models/sandBox/Products.js";

export const getData = async({
        page,
        limit,
        random,
        filters={},
        sort,
        order
    })=>{
    limit = Math.min(limit, 100);
    const cachedData = await getCachedProducts();
    let data = [...cachedData]

    for(const key in filters)
    {
        data = data.filter(item=> String(item[key])===String(filters[key]))
    }

    if(sort)
    {
        data.sort((a,b)=>{
        if (a[sort] === b[sort]) return 0;

        return order === "desc"
            ? (a[sort] < b[sort] ? 1 : -1)
            : (a[sort] > b[sort] ? 1 : -1);
            
        })
    }

    if(random)
    {
        return getRandomProduct(data,limit);
    }
   
    page = Number(page) || 1;
    const start = (page-1)*limit;
    const end = start + limit;

    return data.slice(start,end);
}

export const getDataByID = async (id)=>
{
    let product = await SandboxProduct.findById(id);
    if(!product)
        product = await PRODUCT.findById(id)
    return product
}

export const createData = async(productData)=>{
    return SandboxProduct.create(productData);
}

export const deleteData = async(filter)=>{  // field->kay, value->value
    return await SandboxProduct.findOneAndDelete(filter);
}

export const updateData = async(filter, updateFields)=>{
        return SandboxProduct.findOneAndUpdate(
        filter,
        { $set: updateFields },
        {
            returnDocument: "after",
            runValidators:true 
        }
    );
}