//Middleware for authentication

import User from "../models/User";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {

try{
    const token=req.header.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user=await User.findById(decoded.id).select("-password");
    if(!user){
        return res.json({success: false, message: "Unauthorized access"});
    }
    req.user = user;
    next();
}
catch (err) {
    console.log(err.message);
    res.json({
        success: false,
        message: "Unauthorized access",
        error: err.message
    });
}







}