import { Document } from "mongoose";


export interface IUser extends Document {
    username : string;
    email : string;
    password : string;
    image ?: string;
    isAdmin ?: boolean;
    isUser ?: boolean;
    createdAt : Date;
    updatedAt : Date;
}