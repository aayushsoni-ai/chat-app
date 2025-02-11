import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
};

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({ message: "Email and Password are required." });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ message: "Email already in use." });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const user = await User.create({ email, password: hashedPassword });

        // Generate and send JWT token
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({ message: "Email and Password are required." });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).json({ message: "Invalid email." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(400).json({ message: "Invalid password." });
        }

        // Generate and send JWT token
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId)
        if(!userData) return response.status(404).json({ message: "Invalid email." });
        
        return response.status(200).json({  
                id: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                profileSetup: userData.profileSetup,
                color: userData.color,
        });
    } catch (error) {
        console.error("Login error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};
export const updateProfile = async (request, response, next) => {
    try {
        const {userId} = request
        const {firstName , lastName , color} = request.body
        if(!firstName || !lastName) return response.status(400).json({ message: "First name , lastName , color is required." });
        
        const userData = await User.findByIdAndUpdate(userId,{
            firstName, lastName,color, profileSetup:true
        },{new:true, runValidators:true})

        return response.status(200).json({  
                id: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                profileSetup: userData.profileSetup,
                color: userData.color,
        });
    } catch (error) {
        console.error("Login error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) 
            return response.status(400).json({ message: "File is required." });

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        renameSync(request.file.path, fileName);

        // ✅ Check if user exists
        const user = await User.findById(request.userId);
        if (!user) return response.status(404).json({ message: "User not found" });

        // ✅ Delete old image if exists
        if (user.image && fs.existsSync(user.image)) {
            fs.unlinkSync(user.image);
        }

        user.image = fileName;  // ✅ Store in database
        await user.save();  // ✅ Save changes

        return response.status(200).json({ image: user.image });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};
export const removeProfileImage = async (request, response, next) => {
    try {
        // Find the user in the database
        const user = await User.findById(request.userId);
        if (!user) return response.status(404).json({ message: "User not found." });

        // Delete the file if it exists
        if (user.image) { 
            unlinkSync(user.image);
        }

        user.image = null
        await user.save();

        return response.status(200).json({  
            message: "Profile image removed successfully."
        });

    } catch (error) {
        console.error("Remove profile image error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};
export const logOut = async (request, response, next) => {
    try {
       response.cookie("jwt","",{maxAge:1, secure:true,sameSite:"None"})
        return response.status(200).json({  
            message: "Logout successfully."
        });

    } catch (error) {
        console.error("Remove profile image error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};