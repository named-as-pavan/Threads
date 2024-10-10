import express from 'express';
import dotenv from "dotenv"
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import {app , io, server} from './socket/socket.js'
import path from 'path';


dotenv.config();
connectDB()

const port = process.env.PORT || 5000;

const __dirname = path.resolve();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({ limit: "50mb" }));
// To parse JSON data in request.body 

app.use(express.urlencoded({ extended: true }))


app.use(cookieParser());


app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)


//  http://localhost:5000 for both frontend and backend --->


if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  
// react app
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
  })
}



server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
