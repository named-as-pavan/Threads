import { Server } from 'socket.io';
import http from 'http'
import express from 'express';



const app = express();
const server = http.createServer(app);
import Messaage from '../models/messageModel.js'
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

const userSocketMap = {}  //userId: socketId:
export const getRecipientsSocketId = (recipientId) =>{
    return userSocketMap[recipientId]
};


io.on("connection",(socket)=>{
    console.log("user connected",socket.id)
    const userId = socket.handshake.query.userId;
    if(userId != "undefined") userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //output [1,2,3,4] 

    socket.on('markMessagesAsSeen',async({conversationId,userId})=>{
        try {
            await Message.updateMany({conversationId:conversationId,seen:false},{$set:{seen:true}})
            await Conversation.updateOne({_id:conversationId},{$set:{"lastMessage.seen":true}});
            io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId});
        } catch (error) {
            console.log(error)
        }

    })

    socket.on("disconnect" ,()=>{
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {io,server,app};