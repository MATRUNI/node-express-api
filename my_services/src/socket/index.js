import { Server } from 'socket.io'

let  io;
export function initSocket(httpServer)
{
    io = new Server(httpServer,{
        cors:{
            origin: process.env.FRONTEND_URLS||"http://localhost:5173",
            credentials:true
        }
    })
    return io;
}

export function getIO()
{
    if(!io)
    {
        throw new Error("Socket.io has not been initialized.")
    }
    return io;
}