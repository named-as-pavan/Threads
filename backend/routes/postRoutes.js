import express from "express";
import {createPost,deletePost,getPost,likeUnlikePost, replyToPostPage,getFeedPosts, getUserPosts} from "../controllers/postControler.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed",protectRoute,getFeedPosts);
router.get("/:id",getPost);
router.get("/user/:username",getUserPosts);
router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute,deletePost);
router.put("/likes/:id",protectRoute,likeUnlikePost);
router.put("/reply/:id",protectRoute,replyToPostPage);


export default router