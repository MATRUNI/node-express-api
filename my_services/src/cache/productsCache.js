import PRODUCT from "../models/PRODUCTS.js";

let cache = null;
let cachePromise = null;

export async function getCachedProducts() {

    if (cache) return cache;

    if (!cachePromise) {
        cachePromise = PRODUCT.find().lean()
            .then(data => {
                cache = data;
                cachePromise = null;
                console.log("Cache loaded.");
                return cache;
            })
            .catch(err => {
                cachePromise = null;
                console.log("Cache refresh failed:", err);
                throw err;
            });
    }

    return cachePromise;
}