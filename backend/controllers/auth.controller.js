import bcrypt from "bcryptjs";
import { OAuth2Client } from 'google-auth-library';
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { token } = req.body;
    
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      const { email, name } = payload;
  
      // Split the full name into first and last names
      const [firstName, lastName] = name.split(" ");
  
      // Check if the user exists in the database
      let user = await User.findOne({ email });
  
      if (!user) {
        // Create a new user if it doesn't exist
        user = new User({
          email,
          firstName,
          lastName,
          // You can set a random password since it won't be used for Google SSO
          password: Math.random().toString(36).slice(-8),
        });
        await user.save();
      }
  
      // Generate token and set cookie
      generateTokenAndSetCookie(user._id, res);
  
      res.status(200).json({
        _id: user._id,
        fullName: `${user.firstName} ${user.lastName}`, // Return full name correctly
        email: user.email,
      });
    } catch (error) {
      console.error('Error during Google login', error.message);
      res.status(500).json({ error: 'Google login failed' });
    }
  };
export const signup = async (req, res) => { 
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if user already exists by email
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Generate a hashed password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in Signup Controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if the user exists and if the password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in LogOut controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
