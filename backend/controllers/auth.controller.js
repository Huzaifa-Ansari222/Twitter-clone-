import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

//signup fucn controller
export const signup = async (req, res) => {
    try{
        
        const {fullName, username, email, password} = req.body;// get from req.body
        
        //check email format validation bfre saved to db
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test (email)){
            return res.status(400)
            .json({error:"invalid email format"});
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

        if(password.length < 6){
            return res.status(400)
            .json({error:"password length must be 6 character long"});
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
            generateTokenAndSetCookie(newUser._id,res)// Generate JWT token and set cookie
            await newUser.save();
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

//login func controller
export const login = async (req, res) => {
    try{
        const {username, password} = req.body;//take from req.body
        //find by user by username
        const user = await User.findOne({username})//find username in db 
        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "" );//user pass not empty
        
        if (!user || !isPasswordCorrect) {
            return res.status(400)
            .json({ error: 'Invalid username or password!!' });
        }

        // Generate JWT token and set it in a cookie
        generateTokenAndSetCookie(user._id, res);
        // Respond with user details
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });


    } catch(error){
        console.log('Error in login controller:', error.message);
        res.status(500).json({ error: 'Internal server error!' });
    }
} 

export const logout = async (req, res) => {
    res.json({
        data: "you hit the lo",
    });
} 