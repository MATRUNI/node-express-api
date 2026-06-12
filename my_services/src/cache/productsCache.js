import PRODUCT from "../models/PRODUCTS.js";
let cache=[]
export async function getCachedProducts() 
{
    if(cache.length===0)
    {
        cache = await PRODUCT.aggregate([{$sample: {size: 100}}])
    }
    return cache
}