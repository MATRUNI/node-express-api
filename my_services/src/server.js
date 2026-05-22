import dotenv from 'dotenv'
dotenv.config()
import app from "./app.js";
import connectDB from './config/db.js';
// import {initDB} from './services/logic.js'

async function  startServer() 
{
    // await initDB();
    await connectDB()
    app.listen(3000, ()=>{
        console.log('Server running on Port: 3000');
        console.log('http://localhost:3000');
    })
}
startServer()
