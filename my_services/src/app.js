import express from'express';
import router from './routes/productRoutes.js';
import cors from 'cors'
const app=express();
app.use(cors())
app.use(express.json());

// Printing the route and method server is recieving
app.use((req,res,next)=>{
    console.log("REQUEST:",req.method,req.url);
    next();
});
app.use('/products',router);

export default app;