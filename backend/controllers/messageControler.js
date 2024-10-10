import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientsSocketId, io } from "../socket/socket.js";
import {v2 as cloudinary} from 'cloudinary';

async function sendMessage(req, res) {
    try {
        const { recipientId, message } = req.body;
        let { img } = req.body;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
            await conversation.save();
        }

        if(img){
           const uploadedResponse = await cloudinary.uploader.upload(img);
           img = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            img: img || ""
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            })
        ])

        const recipientSocketId = getRecipientsSocketId(recipientId);
        if(recipientSocketId){
            io.to(recipientSocketId).emit("newMessage",newMessage)
        }


        res.status(201).json(newMessage)



        
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}



async function getMessages(req,res) {

    const { otherUserId } = req.params;
    const userId = req.user._id;
    try {
        const conversation = await Conversation.findOne({
            participants:{$all: [userId,otherUserId]}
        })

        if(!conversation){
            return res.status(400).json({error:"Conversation not found"})
        }

        const messages = await Message.find({
            conversationId:conversation._id
        }).sort({createdAt: 1})

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


async function getConversation(req,res){
    const userId = req.user._id;
    try {
        const conversation = await Conversation.find({participants: userId}).populate({
            path: "participants",
            select: "username profilePic"
        });
        if(!conversation){
            res.status(201).json([])
        }
        //getting only other user not owner 
        conversation.forEach(conversation=>{
            conversation.participants = conversation.participants.filter(
                participants => participants._id.toString() !== userId.toString()
            );
        })


        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}




export { sendMessage, getMessages ,getConversation}





// res.status(500).json({error:error.message});