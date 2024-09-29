import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true
    },
    type:{
        type:'String',
        require: true,
        enum: ['follow', 'like']
    },
    read:{
        type: Boolean,
        default: false,
    },
},{timestamps:true})

export default mongoose.model('Notification', notificationSchema);
