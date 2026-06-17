import PRODUCT from "../models/PRODUCTS.js";
let cache=[]
let lastCachedAt=null;
export async function getCachedProducts() 
{
    let now = Date.now();
    if(cache.length===0 || now - lastCachedAt >= 1000 * 60 * 10)
    {
        cache = await PRODUCT.aggregate([{$sample: {size: 500}}])
        lastCachedAt = Date.now();
    }
    return cache
}