//signup--->done✅

//login---->done✅

//otp------->done✅

//change pswd

const bcrypt = require("bcrypt");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
//signup route handler..

exports.signup = async(req,res)=>{
    try{
        const {email,password,accountType}=req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User Already Exist!!'
            });
        }

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'Error Occured in hashing Password!!',
            })
        }

        const user = await User.create({
            email,password:hashedPassword,accountType
        })

        return res.status(200).json({
            success:true,
            message:'User Created SuccessFully!!'
        });
}
catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:'User Can t be registerd!'
        })
    }
}

exports.login = async(req,res)=>{
    try{
        const {email,password}=req.body;
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:`${email} signup first!`
            });
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:'Wrong Password Enterd!!'
            })
        }

        const payload = {
            email:user.email,
            is:user._id,
            accountType:user.accountType
        };


        if(await isPasswordValid){
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            };

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged In SuccessFully!!"
            });
        }
    }catch(error){
        console.error('Login error:',error);
        return res.status(500).json({
            success:false,
            message:'User Cant\'t Log in!'
        });
    };
};


exports.sendOtp = async(email,otp)=>{
    const title = '!Your OTP Code';
    const body = `<h1>Your Otp  is ${otp}!</h1>`
    try{
        await mailSender(email,title,body);
        console.log('OTP Send Successfully!');
    }catch(error){
        return res.status(500).json({
            status:false,
            message:"OTP generation failed!!!"
        });
    }
}
