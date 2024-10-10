//signup--->done✅

//login---->done✅

//otp------->done✅

//change pswd

const bcrypt = require("bcrypt");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mailSender = require("../utils/mailSender");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const { configDotenv } = require("dotenv");
require("dotenv").config();
//signup route handler..

exports.signup = async(req,res)=>{
    try{
        const {firstName,lastName,email,password,accountType,otp,confirmPassword,contactNumber}=req.body;
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:'All field are required!',
            })
        }if(password!=confirmPassword){
            return res.status(403).json({
                success:false,
                message:"All feild are required!!",
            })
        } 
        const existingUser = await User.findOne({email}).populate("additionalDetails")
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User Already Exist!!'
            });
        }
        //find most recent otp!!
        const recentOtp = await User.findOne({email}).sort({created:-1}).limit(1);        console.log(recentOtp);
        console.log(recentOtp);
        //validate-Otp
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:'Otp Not Found..'
            })
        }else if(otp!== recentOtp.otp){
            return res.status(400).json({
                success:false,
                message:'Otp is Not Valid!!',
            })
        }
    //hashed passwrod...
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'Error Occured in hashing Password!!',
            })
        }
        //Entry Creation in  Db..
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
        const user = await User.create({
            firstName,lastName,email,password:hashedPassword,accountType,additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
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

exports.changePassword = async(req,res)=>{
    //get data from req body
    //get oldPwd,newPwd,confirmPwd,
    //validation

    //update pwd in DB
    //send mail - pwd updated
    //return response
}


/*exports.sendOtp = async(email,otp)=>{
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
*/

exports.sendOTP =async (req,res) => {
    try{
        const {email} =req.body;

        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Registered!!",
            })
        }
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ",otp);
        //check unique otp or not
        const result = await OTP.findOne({otp:otp});

        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp})
        }
        const otpPayload = {email,otp};

        //create an entry in dB for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response
        res.status(200).json({
            success:true,
            message:'OTP sent Successfully!!!',
            otp,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
