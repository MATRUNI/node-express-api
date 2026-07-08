import express from 'express';

import {
  getAllProducts,
  getProductByID,
  getRandomProducts,
} from '../controller/productController.js';
import sandboxProductRouter from './sandbox/routerProducts.js';

const productRouter = express.Router();


productRouter.get('/', getAllProducts);
productRouter.get('/random/:limit', getRandomProducts);

productRouter.get('/random', getRandomProducts);

productRouter.use("/sandbox",sandboxProductRouter)
productRouter.get('/:id', getProductByID);

export default productRouter;