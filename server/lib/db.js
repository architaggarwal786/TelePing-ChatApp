import mongoose from "mongoose";

 export const connectDB = async () => {
    try{
        mongoose.connection.on("connected", () => console.log("MongoDB connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    }catch(err){
        console.log(err);
    }






 }