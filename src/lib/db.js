import mongoose from "mongoose";



export const connectDB = async ()=>{
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGO_URI or MONGODB_URI environment variable is not set');
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Mongodb connection failed", error);
        process.exit(1);
    }
}