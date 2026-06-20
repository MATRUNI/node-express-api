import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js';
import { getById } from '../controller/configController.js';

const router = express.Router();

router.get('/api/:id',asyncHandler(async (req, res)=>{
    const {id} = req.params

    const response = await getById(id)

    if (!response.success) {
        return res.status(404).json({
            message: response.message
        });
    }

    return res.status(200).json(response.data);
}))
export default router