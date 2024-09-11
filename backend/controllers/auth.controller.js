import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export const signup = async (req, res) => {
    try{
        
        const {fullName, username, email, password} = req.body;// get from req.body
        
        //testing email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.text (email)){
            return res.status(400).json({error:"invalid email format"});
        }

        //user exist or not
        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(400)
            .json({error:"username is already taken"});
        }
        //email exit or not
        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400)
            .json({error:"Email is already taken"});
        }

        //hash password
        //pass123 => 3hk4h213k4
        const salt = await bcrypt.genSalt(10);//10 digit random generate
        const hashedPassword = await bcrypt.hash(password,salt);//hash password with salt

        const newUser = new User({
            // fullName:fullName,//same as show we can write fullName
            fullName,
            username,
            email,
            password:hashedPassword,
        })
        
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)//jwt token
            await newsUser.save();
            //send back user details to frntd
            res.status(201).json({ //return value that user set
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })
        } else{
            res.status(400)
            .json({error:"Invalid user data"});
        }


    } catch (error) {
        console.log("error is signup controller", error.message);
        res.status(500)
        .json({error:"Internal sever error"});
    }
}

export const login = async (req, res) => {
    res.json({
        data: "you hit the li",
    });
} 

export const logout = async (req, res) => {
    res.json({
        data: "you hit the lo",
    });
} 