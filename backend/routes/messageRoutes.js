import express from 'express'
import protectRoute from '../middlewares/protectRoute.js'
import { getConversation, getMessages, sendMessage } from '../controllers/messageControler.js'



const router = express.Router()

router.get("/conversations",protectRoute,getConversation)
router.get("/:otherUserId",protectRoute,getMessages)
router.post("/",protectRoute,sendMessage)


export default router