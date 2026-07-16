import 'dotenv/config'
import app from "./app.js";
import connectDB from './config/db.js';
import prisma from './lib/prisma.js';
import { getCachedProducts } from './cache/productsCache.js';
import { createServer } from 'http';
import { initSocket } from './socket/index.js';
import socketAuth from './socket/socketAuth.js';
import registerSocketHandler from './socket/handlers.js';
import cookieParser from 'cookie-parser'
async function startServer() 
{
    
    await Promise.all([
      connectDB(),
      prisma.$connect()
    ]);
    console.log("Mongo & Neon DB connected.")
    const port = process.env.PORT || 3000;
    const httpServer = createServer(app)

    const io = initSocket(httpServer)
    io.use(socketAuth)
    io.engine.use(cookieParser())
    registerSocketHandler(io)
    httpServer.listen(port, ()=>{
        console.log(`Server running on Port: ${port}`);
        console.log(`http://localhost:${port}`);
    })
    console.time("Cache");
    getCachedProducts()
        .then(() => console.timeEnd("Cache"))
        .catch(console.error);
}
startServer()
