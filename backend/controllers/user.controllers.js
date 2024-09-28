import User from '../models/user.model.js';


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
        if(id === req.user._id){
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
            /**/
            await User.findByIdAndUpdate(id, {$pull: { followers: req.users._id}}); //minus fllower
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
            await User.findByIdAndUpdate(id,{$push: { follower: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id}});
            
            //send noti to user
            res.status(200).json({ message: "user followed successfully"});

        }
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("error in getUserProfile:" ,error.message);
        
    }
}