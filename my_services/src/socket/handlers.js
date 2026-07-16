
export default function registerSocketHandler(io)
{
    console.log('connecting')
    io.on("connection",(socket)=>{
        const userId = socket.user.userId
        
        socket.join(`user:${userId}`);
        
        sendOnlineCount(io)

        socket.on("chat:send",(data)=>{
            console.log(data);
            socket.broadcast.emit("chat:receive",data)
        })
        socket.on("disconnect",()=>{
            sendOnlineCount(io)
        })
    })
}
function sendOnlineCount(io) {
    const onlineUsers = [...io.sockets.adapter.rooms.keys()]
        .filter(room => room.startsWith("user:"))
        .length;

    io.emit("members", onlineUsers);
}