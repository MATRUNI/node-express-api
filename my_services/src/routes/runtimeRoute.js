import express from 'express'
import productRouter from './productRoutes.js';
import rateLimit from 'express-rate-limit';
import API_Token_Verify from '../middlewares/API_Token_Verify.js';

const runtimeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req, res) => res.status(429).json({ error: "Too many requests from this IP." })
});

let runtimeRouter=express.Router();
runtimeRouter.use(API_Token_Verify)
runtimeRouter.use('/products',runtimeLimiter,productRouter);


export default runtimeRouter;