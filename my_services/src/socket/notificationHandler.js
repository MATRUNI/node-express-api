import { getIO } from "./index.js";
export function sendNotification({receiverIds, event="config", payload })
{
    const io = getIO()

    receiverIds.forEach((receiverId) => {
        io.to(`user:${receiverId}`).emit(event, payload);
    });
}