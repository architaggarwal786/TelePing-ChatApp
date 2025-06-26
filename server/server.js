import express from 'express';
import http from 'http';
import cors from 'cors';
import "dotenv/config";
import { connectDB } from './lib/db.js';


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({limit: '4mb'}));
app.use("/api/status", (req, res) => {
    res.send("Server is live")
})
await connectDB();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})