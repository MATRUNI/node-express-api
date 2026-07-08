import express from 'express'
import { createProduct, deleteProduct, getProductByUsername, patchData } from '../../controller/productController.js';
import { validateProductCreate, validateProductPatch } from '../../middlewares/validateProductCreate.js';

const sandboxProductRouter = express.Router();

sandboxProductRouter.get('/:username', getProductByUsername);

sandboxProductRouter.post('/', validateProductCreate, createProduct);

sandboxProductRouter.patch('/:id', validateProductPatch, patchData);

sandboxProductRouter.delete('/:id', deleteProduct);

export default sandboxProductRouter