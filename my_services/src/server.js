import app from "./app.js";
import {initDB} from './services/logic.js'

async function  startServer() 
{
    await initDB();
    app.listen(3000, ()=>{
        console.log('Server running on Port: 3000');
        console.log('http://localhost:3000');
    })
}
startServer()
