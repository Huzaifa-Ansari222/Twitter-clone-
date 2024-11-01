import express from 'express';
import dotenv from 'dotenv'
import path from "path";
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary'
import notificationRoutes from './routes/notification.routes.js'
import { fileURLToPath } from 'url'; // Import for path resolution


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000 ;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve()

app.use(express.json({limit:"5mb"}));//middleware to parse the body from req.body / 5mb DOS atkk avoid
app.use(express.urlencoded({extended: true}));//enable x-www-form-url-encoded in postman

//auth token verify
app.use(cookieParser());

//base route
app.use('/api/auth', authRoutes); //allroutes of auth /api/auth + /routes
app.use('/api/users', userRoutes);
app.use('/api/posts/', postRoutes);
app.use('/api/notifications',notificationRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
    });
}

//add port connect mongodb
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectMongoDB();
});

//2:40:00