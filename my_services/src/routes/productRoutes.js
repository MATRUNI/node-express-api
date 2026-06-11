import express from 'express'
import { typeCheck } from '../middlewares/typeCheck.js';
import { createProduct, deleteProduct, findSpecific, getAllProducts } from '../controller/productController.js';
let productRouter=express.Router();

productRouter.get('/',getAllProducts);

productRouter.get('/:field/:type',findSpecific); // /key/value -> price/300);

productRouter.post('/',typeCheck,createProduct);

productRouter.delete('/:field/:type/:isOne', deleteProduct);

export default productRouter;