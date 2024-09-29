import express from 'express';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000 ;

app.use(express.json());//middleware to parse the body from req.body
app.use(express.urlencoded({extended: true}));//enable x-www-form-url-encoded in postman

//auth token verify
app.use(cookieParser());

//base route
app.use('/api/auth', authRoutes); //allroutes of auth /api/auth + /routes
app.use('/api/users',userRoutes)

//add port connect mongodb
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectMongoDB();
});

//1:51:11