import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import notificationModel from '../models/notification.model.js';
import {v2 as cloudinary} from 'cloudinary';

//create post controller func
export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString(); // Converts ObjectId to string format.

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        if(!text && !img ){
            return res.status(404).json({error: "Post must have text or image"});
        }
        if (img){
            const uploadedRespone = await cloudinary.uploader.upload(img);
            img = uploadedRespone.secure_url;//upld to cloudinry
        }
        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
        console.log("Error in createPost controller:" ,error);
        
    }
}

//delete post controller
export const deletePost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);// ../:id
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }
        //check owner of post
        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({error: "You are not authorized to delete this post"});
        }  

        //delte img of post frm cloudinary
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);//delt img from mognodb 
        
        res.status(200).json({message: "Post deleted successfullly"});
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
        console.log("Error in deletePost controller:" ,error);
    }
}

//comment in post controller
export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text){
            return res.status(400).json({ error: "Text field is required"});
        }
        //check post in db or not
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        //else do cmmnt
        const comment = {user: userId, text}//user cmmt save with userId and text/cmmnt / id of user who is cmmnting

        post.comments.push(comment); //adding comment in post douc
        await post.save();
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({error:"Internal server error"});
        console.log("Error in commentOnPost controller:" ,error);
        
    }
}

//like unlike comment controller
export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;//current logged user
        const {id: postId } =req.params;//prams id / pulled from the URL.

        const post = await Post.findById(postId);//look post in db

        if(!post){
            return res.status(404).json({error: "Post not found"})
        }

        //check user liked post aldry?/if their `userId` is in the `likes` array of the post.
        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            //unlike post / pull id of user from array post list 
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}})
            res.status(200).json({message: "Post unliked successfully"})

        } else {
            //if like send notificaation
            push.likes.push(userId);// Add the `userId` to the `likes` array of the post.

            await post.save();
            //import notification model
            const  notification = new Notification ({
                from: userId,
                to:post.user,
                type: "like"//enum type
            })
            await notification.save(); 

            res.status(200).json({message: "Post liked successfully"})
        }
    } catch (error) {
        console.log("Error in linkeUnlikedPost controller:", error);
        res.status(500).json({error:"Internal server error"});
        
    }
}
