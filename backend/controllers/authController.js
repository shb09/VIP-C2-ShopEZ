const User= require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const registerUser=async(req,res)=> {
    try{
     const { username,email,password,userType }= req.body;
      
     if(!username || !email || !password){
          return res.status(400).json({
               message: "Please fill all required fields",
          });
     }
     const exisitingUser = await User.findOne({email});
     if(exisitingUser){
          return res.status(400).json({
               message: "User already exists",
          });
     }
     const hashedPassword = await bcrypt.hash(password,10);
     const newUser=new User({
          username,
          email,
          password: hashedPassword,
          userType,
     });
     await newUser.save();
     res.status(201).json({
          message: "User Registered successfully",
          user: {
               id: newUser._id,
               username: newUser.username,
               email:newUser.email,
               userType: newUser.userType,
          },
     });
    } catch(error){
     res.status(500).json({
          message: error.message,
     });
    }
};
const loginUser= async (req,res)=>{
     try{
          const {email,password}=req.body;
          if(!email||!password){
               return res.status(400).json({
                    message: "Please provide email and password",
               });
          }
          const user = await User.findOne({email});
          if(!user){
               return res.status(400).json({
                    message:"Invalid Credentials",
               });
          }
          const isMatch=await bcrypt.compare(password,user.password);
          if(!isMatch){
               return res.status(400).json({
                    message: "Invalid credentials",
               });
          }
          const token=jwt.sign(
               {
                    id: user._id,
                    userType: user.userType,
               },
               process.env.JWT_SECRET,
               {
                    expiresIn: "7d",
               }
          );
          res.status(200).json({
               message: "Login successful",
               token,
               user: {
                    id: user._id,
                    username:user.username,
                    email:user.email,
                    userType:user.userType,
               },
          });
     }catch(error){
          res.status(500).json({
               message:error.message,
          });
     }
};
const getProfile=async(req,res)=> {
     try{
          res.status(200).json({
               message: "Protected profile route accessed",
               user: req.user,
          });
     }catch(error){
          res.status(500).json({
               message: error.message,
          });
     }
};
const adminDashboard=async(req,res)=>{
     try{
          res.status(200).json({
               message:"Welcome Admin",
               adminData: req.user,
          });
     }catch(error){
          res.status(500).json({
               message: error.message,
          });
     }
};
module.exports={
     registerUser,
     loginUser,
     getProfile,
     adminDashboard,
};