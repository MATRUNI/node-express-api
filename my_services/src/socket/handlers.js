
export default function registerSocketHandler(io)
{
    const calls = new Map();
    io.on("connection",(socket)=>{
        const username = socket.user.username

        // user's room
        socket.join(`user:${username}`);

        // updating UI with latest people only
        broadcastPresence(io)

        // listens to chat:send from users and broadCast to others
        socket.on("chat:send",(data)=>{
            socket.broadcast.emit("chat:receive",data)
        })
        
        // creating call from frontend
        socket.on("call:create",()=>{
            const callId = crypto.randomUUID();

            calls.set(callId, {
                host:username,
                participants:new Set([username])
            });

            socket.join(`call:${callId}`);

            socket.data.callId = callId;

            socket.emit("call:created",{callId})
        })

        // invite people in the calls
        socket.on('call:invite',({to,callId})=>{
            const call = calls.get(callId)
            if(!call) return;

            io.to(`user:${to}`).emit("call:invited",{
                from:username,
                callId
            })
            // asking the user to play call ringtone
            io.to(`user:${to}`).emit("audio:play", {
                track: "call-invite"
            });
        });

        // invited people joining the call room
        socket.on("call:join",({callId})=>{
            const call = calls.get(callId);
            if(!call) return;

            const existingUsers = [...call.participants];

            call.participants.add(username);
            socket.join(`call:${callId}`);

            socket.data.callId = callId;

            socket.emit("call:joined",{existingUsers})

            io.to(`call:${callId}`).emit('call:update',{
                participants:[...call.participants]
            })
        })

        // making offer
        socket.on("offer",({to,offer})=>{
            socket.to(`user:${to}`).emit("offer",{from:username,offer})
        })

        // answer to the offer
        socket.on('answer',({to,answer})=>{
            socket.to(`user:${to}`).emit("answer",{from:username,answer})
        })

        // ICE: Interactive Connectivity Establishment.
        // Find a network path so two peers can communicate directly.
        socket.on("ice",({to,candidate})=>{
            socket.to(`user:${to}`).emit("ice",{from:username,candidate})
        })

        // reject call
        socket.on("call:reject",({callerId})=>{
            socket.to(`user:${callerId}`).emit("call:rejected",{rejectedBy:username})
        })

        // user leaves a call
        socket.on("call:end", () => {
            const callId = socket.data.callId;
            const call = calls.get(callId);
        
            if (!call) return;
            
            call.participants.delete(username);

            if(call.host === username){
                call.host = [...call.participants][0] || null;
            }

            socket.leave(`call:${callId}`);
            socket.data.callId = null;

            io.to(`call:${callId}`).emit("peer:left", {
                peer: username,
                reason:"left"
            });

            io.to(`call:${callId}`).emit("call:update", {
                participants:[...call.participants]
            });

            if (call.participants.size === 0) {
                calls.delete(callId);
            }
        });

        // getting kicked of the call
        socket.on("call:kick", ({callId, peer}) => {

            const call = calls.get(callId);

            if (!call) return;

            if (call.host !== username)
            return;

            if(!call.participants.has(peer))
            return;

            call.participants.delete(peer);
            
            const kickedSockets = io.sockets.adapter.rooms.get(`user:${peer}`);

            kickedSockets?.forEach(socketId => {
                const kicked = io.sockets.sockets.get(socketId)
                kicked?.leave(`call:${callId}`);
            });

            io.to(`call:${callId}`).emit("peer:left", {
                peer,
                reason:"kicked"
            });
        
            io.to(`call:${callId}`).emit("call:update", {
                participants:[
                    ...call.participants
                ]
            });
        });
        socket.on("disconnect",()=>{
            broadcastPresence(io);
        })
    })
}
function getOnlineUsers(io) {
    return [...io.sockets.adapter.rooms.keys()]
        .filter(room => room.startsWith("user:")).map(room => room.substring(5));;
}
function broadcastPresence(io) {
    const users = getOnlineUsers(io);
    io.emit("users:online", users);
}