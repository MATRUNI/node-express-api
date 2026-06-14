import express from 'express'
import { validateProductCreate } from '../middlewares/validateProductCreate.js';
import { createProduct, deleteProduct, findSpecific, getAllProducts } from '../controller/productController.js';
let productRouter=express.Router();

productRouter.get('/',getAllProducts);

productRouter.get('/:field/:type',findSpecific); // /key/value -> price/300);

productRouter.post('/', validateProductCreate, createProduct);

productRouter.delete('/:field/:type/:isOne', deleteProduct);

export default productRouter;