import dotenv from 'dotenv'
dotenv.config()
import app from "./app.js";
import connectDB from './config/db.js';
// import {initDB} from './services/logic.js'

async function startServer() 
{
    // await initDB();
    await connectDB()
    const port = process.env.PORT || 3000;
    app.listen(port, ()=>{
        console.log(`Server running on Port: ${port}`);
        console.log(`http://localhost:${port}`);
    })
}
startServer()
