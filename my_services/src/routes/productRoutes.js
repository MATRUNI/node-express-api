import express from 'express'
import { validateProductCreate } from '../middlewares/validateProductCreate.js';
import { createProduct, 
    deleteProduct, 
    findSpecific, 
    getAllProducts, 
    getPageProducts, 
    getProductByID, 
    getTenRandomProducts, 
    getXRandomProducts } from '../controller/productController.js';
    
let productRouter=express.Router();

productRouter.get('/',getAllProducts);
productRouter.get('/id/:id',getProductByID)
productRouter.get('/page/:number',getPageProducts);

productRouter.get('/random',getTenRandomProducts);

productRouter.get('/random/:limit',getXRandomProducts);

productRouter.get('/:field/:type',findSpecific); // /key/value -> price/300);

productRouter.post('/', validateProductCreate, createProduct);

productRouter.delete('/:field/:type/:deleteOne', deleteProduct);

export default productRouter;