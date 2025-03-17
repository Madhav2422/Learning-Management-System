import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

//Register User
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already registered with this email"
            })
        }


        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            password:hashedPassword
        })
        return res.status(201).json({
            success:true,
            message:"Account created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })
    }
}


//Login user 
export const login =async (req,res)=>{
    try {
        const {email,password}=req.body


        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        
        //If User doesnt exists 
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password "
            })
        }

        //Password Matching
        const isPasswordMatch=await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password "
            })
        }

        //JWT
        generateToken(res,user,`Welcome back ${user.name}`)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to login"
        })
    }
}

// Logout Profile
export const logout=async (req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to log out"
        })
    }
}

//User Profile

export const getUserProfile=async(req,res)=>{
    try {
        const userId=req.id;
        const user=await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }

        return res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load  user profile"
        })   
    }
}



export const updateProfile = async (req, res) => {
    try {
        const userId = req.id; // Assuming req.id holds the user ID from authentication middleware
        const { name } = req.body; // Extract fields from request body
        const profilePhoto = req.file; // Extract uploaded file (if any)

        const user = await User.findById(userId); // Find user by ID
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Create an object to hold the updated data dynamically
        const updatedData = {};

        // Check if 'name' is provided and update it
        if (name) {
            updatedData.name = name;
        }

        // If a profile photo is provided, handle the upload and old photo deletion
        if (profilePhoto) {
            if (user.photoUrl) {
                // Extract the public ID of the old image from the URL
                const publicId = user.photoUrl.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // Delete old image
            }

            // Upload new photo to Cloudinary
            const cloudResponse = await uploadMedia(profilePhoto.path);
            updatedData.photoUrl = cloudResponse.secure_url; // Add new photo URL to updatedData
        }

        // Update the user document with the new fields
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
            new: true, // Return the updated document
        }).select("-password"); // Exclude password from response

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};
