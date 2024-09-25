import express from 'express';
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000 ;

app.use(express.json());//middleware to parse the body from req.body
app.use(express.urlencoded({extended: true}));//enable x-www-form-url-encoded in postman

//auth token verify
app.use(cookieParser());

//base route
app.use('/api/auth', authRoutes); //allroutes of auth /api/auth + /routes


//add port connect mongodb
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectMongoDB();
});