import Message from "../models/MessagesModel.js"
import {mkdirSync, renameSync} from "fs"
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({
    cloud_name: "dzu233lit",
    api_key: "244848338474611",
    api_secret: "m8HLa4akMh1uoDc3C8_W1Nm9edk"
});

export const getMessages = async (request, response, next) => {
    try {
        const user1 = request.userId
       const user2 = request.body.id
       if(!user1 || !user2){
          return response.status(400).json({  
               message: "Both user ID's are required"
           });
       }
     const messages = await Message.find({
        $or:[
            {sender:user1,recipient:user2},{sender:user2,recipient:user1},
        ],
     }).sort({timesptamp:1})
       return response.status(200).json({messages})

    } catch (error) {
        console.log({error})
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const uploadFile = async (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).send("File is required!");
        }

        console.log("Uploading file:", request.file.originalname);

        // ✅ Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(request.file.path, {
            folder: "files",
            resource_type: "auto", // Supports images, videos, PDFs, etc.
        });

        return response.status(200).json({ filePath: result.secure_url });

    } catch (error) {
        console.error("File upload error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};