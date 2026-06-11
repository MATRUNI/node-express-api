import express from'express';
import cookieParser from 'cookie-parser'
import globalErrorHandlers from './middlewares/errorMiddleWare.js'
import APIRouter from './routes/APIRoute.js'
import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'

import cors from 'cors'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requireApiKey } from './middlewares/requireApiKey.js';
import { blockBots } from './middlewares/blockBots.js';
import runtimeRouter from './routes/runtimeRoute.js';

const app=express();

app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.FRONTEND_URLS||"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials:true
}));

app.use(helmet());

// Apply Bot Blocker and API Key requirement early in the stack
app.use(blockBots);
app.use(requireApiKey);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: process.env.NODE_ENV === 'local' ? 10000 : 100, // High limit for local testing
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(apiLimiter);

app.use(express.json({ limit: '10kb' }));
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

app.use('/api',APIRouter)
app.use('/api/auth',AuthRoute)
app.use('/api/users',UserRoute)

app.use('/runtime',runtimeRouter)

app.use(globalErrorHandlers)
export default app;