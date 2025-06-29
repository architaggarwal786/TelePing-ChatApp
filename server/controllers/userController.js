import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//Signup new user
export const signup = async (req, res) => {
  const { email, fullName, password, bio } = req.body;
  try {
    if (!email || !fullName || !password || !bio) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id);
    res.json({ success: true, user: newUser, token, message: "User created " });
  } catch (err) {
    console.log(err.message);
    res.json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

//login user

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!userData || !isPasswordValid) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    const token = generateToken(userData._id);
    res.json({
      success: true,
      user: userData,
      token,
      message: "User logged in successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

//controller to update user profile

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true });
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio, profilePic: upload.secure_url },
        { new: true }
      );
    }
    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};
//send messager to dselected user
export const sendMessage = async (req, res) => {
  try {
    const {  text,image } = req.body;
    const sender = req.user._id;
    const receiver = req.params.id;
    let imageUrl = null;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }
    const newMessage = await Message.create({
      sender,
      receiver,
      text,
      image: imageUrl,
    });

    if (!receiver || !text) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

     

    res.json({
      success: true,
      message: newMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};