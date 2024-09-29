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
            return res.status(400).json({error:"you cant follow/unfollow yourself"});
        }
        //check user tomodify or currnt user find or not
        if(!userToModify || !currentUser){
            return res.status(400).json({error:"user not found"});
        }
        //chek u following user or not
        const isFollowing = currentUser.following.includes(id);//following schema

        if(isFollowing){
            //unnfllw user
            await User.findByIdAndUpdate(id, {$pull: { followers: req.user._id}}); //minus fllower
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id }});//me minus user frm fllwing
            res.status(200).json({ message: "user unfollowed successfully"});
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
            res.status(200).json({ message: "user followed successfully"});

        }
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("error in getUserProfile:" ,error.message);
        
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
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: "user not found"});
    } catch (error) {
        
    }
}