import { atom } from "recoil";
import Conversation from './../src/components/Conversation';




export const conversationsAtom = atom({
    key: "conversationssAtom",
    default:[],
})


export const selectedConversationAtom = atom({
    key:"selectedConversationAtom",
    default:{
        _id:"",
        userId:"",
        username:'',
        userProfilePic:"",
    }
})