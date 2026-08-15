
export default function registerSocketHandler(io)
{
    const calls = new Map();
    io.on("connection",(socket)=>{
        const {username,userId} = socket.user

        // user's room
        socket.data.userId = userId;
        socket.data.username = username;
        socket.join(`user:${userId}`);
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
                host:userId,
                participants:new Set([userId])
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
                from:userId,
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

            call.participants.add(userId);
            socket.join(`call:${callId}`);

            socket.data.callId = callId;

            socket.emit("call:joined",{existingUsers})

            io.to(`call:${callId}`).emit('call:update',{
                participants:[...call.participants]
            })
        })

        // making offer
        socket.on("offer",({to,offer})=>{
            socket.to(`user:${to}`).emit("offer",{from:userId,offer})
        })

        // answer to the offer
        socket.on('answer',({to,answer})=>{
            socket.to(`user:${to}`).emit("answer",{from:userId,answer})
        })

        // ICE: Interactive Connectivity Establishment.
        // Find a network path so two peers can communicate directly.
        socket.on("ice",({to,candidate})=>{
            socket.to(`user:${to}`).emit("ice",{from:userId,candidate})
        })

        // reject call
        socket.on("call:reject",({callerId})=>{
            socket.to(`user:${callerId}`).emit("call:rejected",{rejectedBy:userId})
        })

        // user leaves a call
        socket.on("call:end", () => {
            const callId = socket.data.callId;
            const call = calls.get(callId);
        
            if (!call) return;
            
            call.participants.delete(userId);

            if(call.host === userId){
                call.host = [...call.participants][0] || null;
            }

            socket.leave(`call:${callId}`);
            socket.data.callId = null;

            io.to(`call:${callId}`).emit("peer:left", {
                peer: userId,
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

            if (call.host !== userId)
            return;

            if(!call.participants.has(peer))
            return;

            call.participants.delete(peer);
            
            const kickedSockets = io.sockets.adapter.rooms.get(`user:${peer}`);

            kickedSockets?.forEach(socketId => {
                const kicked = io.sockets.sockets.get(socketId)
                kicked?.leave(`call:${callId}`);
                kicked?.emit("call:kicked", {
                    callId
                });
                kicked.data.callId = null;
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

        socket.on("ping",(cb)=>{
            cb()
        })

        socket.on("disconnect",()=>{
            broadcastPresence(io);
        })
    })
}
function getOnlineUsers(io) {
    const users = new Map();

    for (const socket of io.sockets.sockets.values()) {
        const { userId, username } = socket.data;

        if (userId) {
            users.set(userId, {
                userId,
                username
            });
        }
    }

    return [...users.values()];
}

function broadcastPresence(io) {
    io.emit("users:online", getOnlineUsers(io));
}
