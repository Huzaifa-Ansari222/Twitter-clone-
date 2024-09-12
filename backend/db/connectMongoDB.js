import mongoose from "mongoose";

const connectMongoDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);//connect to db
        console.log(`mongodb connected:${conn.connection.host}`);
        
    } catch (error) {
        console.log(`errorr connection to mongoDB: ${error.message}`);
        process.exit(1);
        
    }

}

export default connectMongoDB;