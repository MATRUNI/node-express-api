import express from'express';
// import router from './routes/productRoutes.js';
import APIRouter from './routes/APIRoute.js'
import cors from 'cors'
const app=express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.options('*', cors());
app.use(express.json());

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
export default app;