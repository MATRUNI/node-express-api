import PRODUCT from "../models/PRODUCTS.js";
let cache=[]
let lastCachedAt=Date.now();
let isRefreshing = false
export async function getCachedProducts() 
{
    let now = Date.now();
    const isExpired = now - lastCachedAt >= 10*60*1000;
    if(cache.length===0 || isExpired)
    {
        if(!isRefreshing)
        {
            isRefreshing = true;
            try 
            {
                cache = await PRODUCT.find().lean();
                lastCachedAt = now;
            } 
            catch (error) 
            {
                console.log("Cache refresh failed:", error)
            }
            isRefreshing = false
        }
    }
    return cache
}