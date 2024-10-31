import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;//logged-in user'

        // Finding all notifications in the database where the "to" field matches the user's ID.
        const notifications = await Notification.find({ to:userId})
        .populate({
            path: "from",
            select:"username profileImg",
        });

        await Notification.updateMany({to:userId}, {read:true});

        res.status(200).json(notifications);

    } catch (error) {
        console.log("Error in getNotifications function", error.message);
        res.status(500).json({error:"Internal server error"});
        
    }
}


//delete notitfications s
export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to:userId});

        res.status(200).json({message:"Notification deleted successgully"});

    } catch (error) {
        console.log("Error in deleteNotifications function", error.message);
        res.status(500).json({error:"Internal server error"});
        
    }
}

//delte a notification
// export const deleteNotification = async (req, res) => {
//     try {
//         //
//         const notificationId = req.params.id;
//         const userId = req.user._id;//
//         const notification = await Notification.findById(notificationId);

//         if(!notification){
//             return res.status(404).json({error:"Notification not found"});
//         }

//         if(notification.to.toString() !== userId.toString()){
//             return res.status(403).json({error:"You are not allowd to delete this notification"})
//         }

//         await Notification.findByIdAndDelete(notificationId);
//         res.status(200).json({message:"Notification deleted successsully"});
//     } catch (error) {
//         console.log("Error in deleteNotification function", error.message);
//         res.status(500).json({error:"Internal server error"});
        
//     }
// }