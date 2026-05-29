import dotenv from 'dotenv'
dotenv.config()
import app from "./app.js";
import connectDB from './config/db.js';
import prisma from './lib/prisma.js';

async function startNeonDB() 
{
    await prisma.$connect()
    console.log('NEON Connected')
}


async function startServer() 
{
    
    await connectDB()
    await startNeonDB()
    const port = process.env.PORT || 3000;
    app.listen(port, ()=>{
        console.log(`Server running on Port: ${port}`);
        console.log(`http://localhost:${port}`);
    })
}
startServer()
