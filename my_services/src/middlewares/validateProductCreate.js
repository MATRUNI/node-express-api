import whitelist from '../utils/ProductWhiteList.js';
import { productFields } from '../utils/AllowedProductFields.js';
import { makeSKU,makeSlug } from '../utils/genericHelper.js';
import SandboxProduct from '../models/sandBox/Products.js';

export const validateProductCreate = async (req, res, next) => {
    try {
        
        const sanitizedData = whitelist(req.body,productFields.create)
        const data = {
            ...sanitizedData,
            slug: makeSlug(req.body.name),
            sku: makeSKU(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            owner: req.user.username
        };
        console.log(req.user)

        const productInstance = new SandboxProduct(data);
        
        await productInstance.validate();
        req.verifiedProduct = data
        next();
    } catch (error) {
        return res.status(400).json({ 
            error: "Validation failed", 
            details: error.errors||error.message 
        });
    }
};
export const validateProductPatch = async (req, res, next) => {
    try {
        const sanitizedData = whitelist(req.body,productFields.update)

        req.verifiedProduct = sanitizedData
        next();
    } catch (error) {

        return res.status(400).json({ 
            error: "Validation failed", 
            details: error.errors||error.message 
        });
    }
};
