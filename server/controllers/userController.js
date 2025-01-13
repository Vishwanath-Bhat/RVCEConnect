const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const validator = require('validator')
const cloudinary = require('cloudinary').v2

const createToken = (_id,role) =>{
   return jwt.sign({_id: _id,role:role},process.env.SECRET, {expiresIn: '3d'})
}



const cookieOptions = {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: false,
   // Ensures cookies are sent over HTTPS
    sameSite: "lax", // Adjust if cross-site requests are involved ('none' for full cross-origin cookies)
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  };



//Login user
const loginUser = async (req, res) => {
    const { username, password, role} = req.body;
//    console.log("Inside  login")
//     console.log(role)

    try {
        // Find the user by username
        const user = await User.findByUsername(username);
        // console.log(user)
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Create a token
        const token = createToken(user.id,role);
        // res.cookie("token", token, cookieOptions);
        // Respond with username and token
        res.cookie("token", token, cookieOptions).status(200).json({ username: user.username, token, role });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

//signup user
const signupUser = async (req, res) => {
    const { username, password, email, department, admissionYear, role} = req.body;
    const profilePhoto = req.file ? req.file.path : null;
    console.log(profilePhoto)
    if (!profilePhoto) {
        return res.status(400).json({ message: 'Profile Photo is required.' });
    }


    try {
        // Check if username or email already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }
    
        const existingUserEmail = await User.findByEmail(email);
        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already in use." });
        }
    
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'user_documents', // Cloudinary folder to store documents
            resource_type: 'auto',     // Automatically detect file type
        });


        const profilePhoto = uploadResult.secure_url;
        console.log(profilePhoto)
    
        // Create the new user
        const newUser = await User.create(username, hash, email, department, admissionYear,profilePhoto);
    
        // Create a token
        const token = createToken(newUser.id, role);
        // console.log(token)
        // Return success message with token and username
        res.cookie("token", token, cookieOptions).status(201).json({ 
            message: "User registered successfully!", 
            token, 
            username,
            role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user." });
    }
}

const logoutUser = (req, res) => {
    try {
        // Clear the cookie by its name (e.g., "user-token")
        res.clearCookie("token", {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", // Use true in production (HTTPS)
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error during logout." });
    }
};


const getProfileDetails = async(req,res)=>{
    const {token ,role, username, id}=req.user;

    

    return res.status(200).json({
        token, role, username, id
    })
}
module.exports = {signupUser, loginUser,getProfileDetails, logoutUser}