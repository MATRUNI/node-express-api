import express from 'express';

import {
  validateProductCreate,
  validateProductPatch
} from '../middlewares/validateProductCreate.js';

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductByID,
  getProductByUsername,
  getRandomProducts,
  patchData
} from '../controller/productController.js';

const productRouter = express.Router();


productRouter.get('/', getAllProducts);
productRouter.get('/random/:limit', getRandomProducts);

productRouter.get('/sandbox/:username', getProductByUsername);

productRouter.get('/random', getRandomProducts);

productRouter.get('/:id', getProductByID);

productRouter.post('/', validateProductCreate, createProduct);

productRouter.patch('/:id', validateProductPatch, patchData);

productRouter.delete('/:id', deleteProduct);

export default productRouter;