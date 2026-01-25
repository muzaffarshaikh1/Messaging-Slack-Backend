import { JOIN_CHANNEL } from "../utils/common/eventConstants.js";

export default function messageHandlers(io,socket){
    console.log("messageHandlers called")
    socket.on(JOIN_CHANNEL,async function joinChannelHandler(data,cb){
        const roomId = data.channelId;
        
        console.log(`user joined room: ${roomId}`);
        socket.join(roomId);
        console.log(`User ${socket.id} joined the channel: ${roomId}`);
        cb?.({
            success:true,
            message:"Successfully joined the channel",
            data:roomId
        })
    })
}