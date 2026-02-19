import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()


export const connectDB = async () => {
    try {
        if(!process.env.MONGO_URI){
            return "Please connect the MONGODB"
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected.....");
    } catch (error) {
        console.log("Error connecting DB",error);
    }
}




