import User from '../models/userModel.js';
import Message from '../models/messageModel.js';
import { io,userSocketMap } from '../server.js';
import cloudinary from '../lib/cloudinary.js';

//get all usrs except the logged in user

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password ");
    //count the number of unseen messages for each user

    const unseenMessages = {}
    const promises = filteredUsers.map(async (user) => {
    //   const unseenCount = await Message.countDocuments({
    //     receiver: user._id,
    //     seen: false,
    //     sender: { $ne: userId }
    //   });
    const unseenCount = await Message.countDocuments({
  receiver: userId,
  seen: false,
  sender: user._id
});

      unseenMessages[user._id] = unseenCount;
      if(unseenCount > 0) {
        unseenMessages[user._id] = unseenCount;
    }});

    await Promise.all(promises);
    res.json({
      success: true,
        users: filteredUsers,
        unseenMessages: unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }





}

//get all msgs for selected user
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { sender: userId, receiver: loggedInUserId }
      ]
    })
    await Message.updateMany(
      { sender: userId, receiver: loggedInUserId },
      { seen: true }
    );

    res.json({
      success: true,
      messages
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
//api to mark messages as seen using messageId
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { seen: true });
    res.json({
      success: true,
      message: "Message marked as seen"
    });}catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Something went wrong",
      error: error.message})
    }}

    //Send message to selected user
export const sendMessage = async (req, res) => {
try {
  const{text,image}=req.body;
  const receiverId = req.params.id;
  const senderId = req.user._id;
  let imageURL;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image) 
      imageURL= uploadResponse.secure_url;
}
    const newMessage = await Message.create({
      text,
      image: imageURL,
      sender: senderId,
      receiver: receiverId
    });
    //emit the new message to the sender and receiver
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
res.json({
  success: true,
  message: newMessage
});

  
} catch (error) {
  console.log(error.message);
  req.json({
    success: false,
    message: "Something went wrong",
    error: error.message
  });
}
}