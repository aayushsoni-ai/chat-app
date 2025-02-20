import express from "express";
import dotenv from  "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./route/AuthRoutes.js";
import contactRoutes from "./route/ContactRoutes.js";
import setupSocket from "./Socket.js";
import messagesRoutes from "./route/MessagesRoutes.js";
import channelRoutes from "./route/ChannelRoutes.js";


dotenv.config();
console.log("Database URL:", process.env.DATABASE_URL);

const app = express();
const port = process.env.PORT || 3001;

app.use(
    cors({
        origin:[process.env.ORIGIN],
        methods:["GET","POST","PUT", "PATCH","DELETE"],
        credentials: true,
    })
)

app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))


app.use(cookieParser())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/contacts",contactRoutes)
app.use("/api/messages",messagesRoutes)
app.use("/api/channels",channelRoutes)

const server = app.listen(port, ()=>{
    console.log(`Server is running at ${port}`)
});

setupSocket(server)

mongoose
.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/chat_app")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
