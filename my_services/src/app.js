import express from'express';
// import router from './routes/productRoutes.js';
import cookieParser from 'cookie-parser'
import globalErrorHandlers from './middlewares/errorMiddleWare.js'
import APIRouter from './routes/APIRoute.js'
import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'

import cors from 'cors'
const app=express();
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

// Printing the route and method server is recieving
app.use((req,res,next)=>{
    console.log(`REQUEST: [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// for waking the cold server
app.get('/health',(req,res)=>{
    res.json({health:"OK"})
})
// app.use('/products',router);
app.use('/api',APIRouter)
app.use('/api/auth',AuthRoute)
app.use('/api/users',UserRoute)

app.use(globalErrorHandlers)
export default app;