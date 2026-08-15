import express from 'express'
import productRouter from './productRoutes.js';
import rateLimit from 'express-rate-limit';
import verifyToken from '../middlewares/verifyToken.js';
import runtimeCounter from '../middlewares/runtimeCounter.js';

const runtimeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req, res) => res.status(429).json({ error: "Too many requests from this IP." })
});

let runtimeRouter=express.Router();
runtimeRouter.use(verifyToken)
runtimeRouter.use(runtimeCounter)
runtimeRouter.use('/products',runtimeLimiter,productRouter);


export default runtimeRouter;