import mongoose from "mongoose";

//making collection of users
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        // select: false, //edited by me
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
        },
    },
    {timestamps: true}
);

//making models
const User = mongoose.model("User",userSchema); //Users in db
export default User;