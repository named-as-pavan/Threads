import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import bcryptjs from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/helper/generateTokenAndSetCookies.js'
import {v2 as cloudinary} from 'cloudinary'
import mongoose from "mongoose";
import Post from "../models/postModel.js";

const getUserProfile = async (req, res) => {

    // we have a situation that we need to fetch users from their id or username so
    // query is used to fetch such optional api address

    const { query } = req.params;
    try {
        let user ;
        // query is userId
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id :query}).select("-password").select("-updatedAt")
        }
        // query is username

        else{
            user = await User.findOne({username:query}).select("-password").select("-updatedAt")
        }
        if (!user) return res.status(404).json({ success:false , error: "User not found" });


        res.status(200).json(user)


    } catch (error) {
        res.status(404).json({error:error.message})
    }
}


const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] })

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);


        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            })
        }
        else {
            res.status(400).json({ message: "Invalid  Userdata" })
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
        console.log("Error in sign up", error.message)
    }
}


const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // Check if user exists
        if (!user) return res.status(400).json({ error: "User not found" });

        // Check password match
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(400).json({ error: "Password doesn't match" });

        if(user.isFroozen){
            user.isFroozen = false;
            await user.save();
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in login:", error.message); // Log error message
        res.status(500).json({ error: error.message });
    }
};


const logoutUser = async (req, res) => {

    try {
        res.cookie("jwt", "", { maxAge: 1 })
        res.status(200).json({ message: "User logged out successfully" })

    } catch (error) {
        res.status(400).json({ error: "Error loging out" })
        console.log("Error logingout", error.message)

    }
}


const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id)
        if (id === req.user.id.toString()) return res.status(400).json({ message: "You cannot follow/unfollow yourself!" })

        if (!userToModify || !currentUser) return res.status(400).json({ message: "User not found" })

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            res.status(200).json({ message: "User unfollowed successfully" })
        }
        else {
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            res.status(200).json({ message: "User followed successfully" })
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log("Error while following and unfollowing", error.message)
    }

}

const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        if (req.params.id !== userId.toString()) return res.status(400).json({ error: "You can't update other users' profiles" });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        if (profilePic) {
            try {
                if (user.profilePic) {
                    const publicId = user.profilePic.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                const uploadedResponse = await cloudinary.uploader.upload(profilePic);
                profilePic = uploadedResponse.secure_url;
            } catch (error) {
                console.error('Error handling profile picture:', error);
                return res.status(500).json({ error: 'Error updating profile picture' });
            }
        }

        // Update user fields
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        await user.save();


        // Finding all posts that this user is replied and updated username and userProfilePic fields
        await Post.updateMany(
            {"replies.userId":userId},
            {$set:{
                "replies.$[reply].username":user.username,
                "replies.$[reply].userProfilePic":user.profilePic,
            }
        },
            {arrayFilters:[{"reply.userId":userId}]}
        )




        // dont send password
        user.password=null

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error updating profile:", error.message);
    }
};


const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id; // Ensure req.user is populated correctly

        // Fetch the list of users followed by the current user
        const userFollowedByYou = await User.findById(userId).select("following");
        if (!userFollowedByYou) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Aggregate users, excluding the current user
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }, // Exclude current user
                }
            },
            {
                $sample: { size: 5 } // Get 5 random users
            }
        ]);

        // Ensure that we have users to filter
        if (!users.length) {
            return res.status(404).json({ error: 'No users found' });
        }

        // Filter users who are not followed by the current user
        const filteredUsers = users.filter(user => !userFollowedByYou.following.includes(user._id));

        // Slice to get the top 4 suggested users
        const suggestedUsers = filteredUsers.slice(0, 4);

        // Remove sensitive information (e.g., password)
        suggestedUsers.forEach(user => {
            delete user.password; // Omit password from the response
        });

        // Return the suggested users
        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.error('Error handling suggested users:', error);
        return res.status(500).json({ error: 'Error suggesting users' });
    }
};

const freezeAccount = async (req,res)=>{
    try {
        const user = await User.findOne(req.user._id)
        if(!user){
            return res.status(404).json("User not found")
        }

        user.isFroozen = true;
        await user.save();

        res.status(200).json({success:true})


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}





export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile ,getSuggestedUsers , freezeAccount}