import bcrypt from 'bcryptjs';

import {v2 as cloudinary} from 'cloudinary';
//model
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js'

//get user controller func
export const getUserProfile = async (req, res) => {
    const {username} = req.params;//get dynamic user value from param

    try {
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            return res.status(404).json({error:"user not found"})
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("error in getUserProfile:" ,error.message);
        
    }
}

//use follow unfollow controller func
export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;//:id
        const userToModify = await User.findById(id);//find user to be fllow/unflw /anyone /.id
        const currentUser = await User.findById(req.user._id);//the currnt logged in user/ me /._id

        //check user follw himself not
        if(id === req.user._id.toString()){//obj to string same type as param
            return res.status(400).json({error:"You can't follow/unfollow yourself"});
        }
        //check user tomodify or currnt user find or not
        if(!userToModify || !currentUser){
            return res.status(400).json({error:"User not found"});
        }
        //chek u following user or not
        const isFollowing = currentUser.following.includes(id);//following schema

        if(isFollowing){
            //unnfllw user
            await User.findByIdAndUpdate(id, {$pull: { followers: req.user._id}}); //minus fllower
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id }});//me minus user frm fllwing

            //TODO return the id of thre user as a respone
            res.status(200).json({ message: "User unfollowed successfully"});
        } else{
            //fllow user       
/*
Huzz has the ID 1.
Hanj has the ID 2.
Follow Action:
When Huzz wants to follow Hanj, this is what happens:

Hanj's followers array before the action is []. No one is following Hanj yet.
Huzz's following array before the action is []. Huzz is not following anyone yet.
1. Follow Hanj:
javascript
Copy code
await User.findByIdAndUpdate(2, { $push: { followers: 1 } });
await User.findByIdAndUpdate(1, { $push: { following: 2 } });
Huzz's ID (1) is pushed into Hanj's followers array:
Before: Hanj.followers = []
After: Hanj.followers = [1] (Huzz is now following Hanj)
Hanj's ID (2) is pushed into Huzz's following array:
Before: Huzz.following = []
After: Huzz.following = [2] (Huzz is now following Hanj)
So, after the follow action:

Huzz's following array becomes [2].
Hanj's followers array becomes [1].
*/
            await User.findByIdAndUpdate(id,{$push: { followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id}});
            
            //send notif to user
            const newNotification = new Notification ({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });
            // save in db
            await newNotification.save();

            //todo retun the id of the user as a respone
            res.status(200).json({ message: "User followed successfully"});

        }
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error in getUserProfile:" ,error.message);
        
    }
}

//
export const getSuggestedUsers = async (req, res) => {
    try {
        //exclude myself and ppl i fllw frm suggestion list
        const userId = req.user._id;
        
        const userFollowedByMe = await User.findById(userId).select("following");

        //get 10 suggestion user excluded me
        const users = await User.aggregate([
            {
                //using aggregation pipeine of mongodb
                $match:{
                    _id: {$ne:userId}//not equal my id
                }
            },
            {
                $sample:{size:10}//give 10 user so sercure if i follow them then easily exclued and get filter 4 
            },
            {
                $project: {
                    password: 0, // Exclude password in the result
                    // email: 0,// 1 to on 0 to off
                }
            }
        ])
        // Filter out users that are already in my following list
        const filteredUsers = users.filter(user=>!userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0,4)//select 4 user frm filter list as suggested users
        res.status(200).json(suggestedUsers)

        // suggestedUsers.forEach((user) => (user.password = null));
    } catch (error) {
        console.log("error in getSuggestedUsers:",error.message);
        res.status(500).json({error: error.message});
        
    }
}

export const updateUser = async (req, res) => {
    //to update user details
    const {fullName, email, username, currentPassword, newPassword, bio, link} = req.body;
    let {profileImg, coverImg} = req.body;

    const userId = req.user._id;//get current user id
    try {
        //check ur or not
        let user = await User.findById(userId);//let use becz we update it later
        if(!user) return res.status(404).json({ message: "User not found"});

        //give newpass and curnnt both
        if ( (!newPassword && currentPassword) || (!currentPassword && newPassword) ){
            return res.status(404).json({ message: "Please provide both current password and new password"});
        }
        //compare crnt pass vs old pass
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);//currentpass compare to dbPassword
            if(!isMatch) return res.status(404).json({error: "Current password is incorrect"});
            if(newPassword.length < 6){
                return res.status(400).json({error: "Password must be at leat 6 characters long"});
            }
            //hash and salt pass again 
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        //update profle img and coverimg
        if(profileImg){
            //delete old profile in cloudinary
            if(user.profileImg){
                //http://res.cloudinary.com/sdasd/imgage/upload/v1s23r/###########id.png
                // delete profile img by targeting id of img 
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);//pop frm last and split by . and get first which is id
            }
            //upload new profile
            const uploadedRespone = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedRespone.secure_url;//set upload profile
        }

        if(coverImg){
            //delete old cover in cloudinary
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            // upld new cover 
            const uploadedRespone = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedRespone.secure_url;//set upload coverimg
        }

        //update to db
        //if user give new data update it if not put old one
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        
        user = await user.save();

        user.password = null;//not send pass of user

        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in updateUser:", error.message);
        res.status(500).json({error: error.message});
        
    }
}