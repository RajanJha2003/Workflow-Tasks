import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { name, email , password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email  are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }
   const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email,password:hashedPassword });
    await user.save();

    const token=await jwt.sign({userId:user._id,userRole:user.role},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.cookie('token',token,{
      httpOnly:true,
      maxAge:24*60*60*1000,
      sameSite:"strict"
    })



    res.status(201).json({ message: "User created", user,token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email , password } = req.body;

    if ( !email || !password) {
      return res.status(400).json({ message: "Name, email  are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User does not exists" });
    }
   const comparePassword = await bcrypt.compare(password,user.password);
    if(!comparePassword){
      return res.status(409).json({ message: "Invalid Credentials" });
    }
    

    const token=await jwt.sign({userId:user._id,userRole:user.role},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.cookie('token',token,{
      httpOnly:true,
      maxAge:24*60*60*1000,
      sameSite:"strict"
    })



    res.status(201).json({ message: "User logged in", user,token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const currentUser=async(req,res)=>{
  try {
    
    const user=await User.findById(req.userId);
    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    return res.status(200).json({message:"User found",user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}


export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};