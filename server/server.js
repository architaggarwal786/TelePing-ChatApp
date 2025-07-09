import express from 'express';
import http from 'http';
import cors from 'cors';
import "dotenv/config";
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';



const app = express();
const server = http.createServer(app);
// Socket.io setup
export const io = new Server(server, {
    cors: {
        origin: "*"
    },
});

//Store online users
export const userSocketMap = {}; // Map to store userId and socketId
//Socket.io connection
io.on("connection", (socket) => {
    const userId=socket.handshake.query.userId;
    console.log("User connected",userId);

    if(userId){
        userSocketMap[useId]=socket.id;
    }
    io.emit("getOnline",Object.keys(userSocketMap));
    socket.on("disconnect ",()=>{
        console.log("User disconnected",userId);
        delete userSocketMap[userId]; // Remove the user from the map
        io.emit("getOnline",Object.keys(userSocketMap));
    });

    // // Listen for user logout
    // socket.on("userLogout", (userId) => {
    //     delete userSocketMap[userId]; // Remove the user from the map
    //     console.log(`User ${userId} logged out`);
    // });

    // // Handle disconnection
    // socket.on("disconnect", () => {
    //     console.log("Client disconnected");
    //     // Optionally, you can remove the user from the map if needed
    // });
});
app.use(cors());
//Routes Setup
app.use(express.json({limit: '4mb'}));
app.use("/api/status", (req, res) => {
    res.send("Server is live")
})
app.use("/api/auth",userRouter)
app.use("/api/messages", messageRouter);
await connectDB();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})