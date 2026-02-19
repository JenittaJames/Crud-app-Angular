import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/Imodel.js";

const userSchema = new Schema<IUser>({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    isUser : {
        type : Boolean,
        default : true
    }
},{timestamps : true})


export const User = mongoose.model<IUser>("User",userSchema)