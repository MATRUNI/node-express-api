import PRODUCT from '../models/PRODUCTS.js';

export const validateProductCreate = async (req, res, next) => {
    try {
        // Add expireAt field for 5 minutes from now
        req.body.expireAt = new Date(Date.now() + 5 * 60 * 1000);

        // We can use Mongoose's built-in validation by creating a temporary instance
        // This will strictly check against the PRODUCT schema (types, required fields, max length, etc.)
        const productInstance = new PRODUCT(req.body);
        
        // validate() will throw an error if the data doesn't match the schema rules
        await productInstance.validate();

        next();
    } catch (error) {
        // If Mongoose validation fails, return a 400 error with the validation details
        return res.status(400).json({ 
            error: "Validation failed", 
            details: error.message 
        });
    }
};
