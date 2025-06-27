import User from '../models/userModel.js';
import Message from '../models/messageModel.js';

//get all usrs except the logged in user

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password ");
    //count the number of unseen messages for each user

    const unseenMessages = {}
    const promises = filteredUsers.map(async (user) => {
      const unseenCount = await Message.countDocuments({
        receiver: user._id,
        seen: false,
        sender: { $ne: userId }
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