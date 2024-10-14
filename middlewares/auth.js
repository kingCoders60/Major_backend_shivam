const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
//auth
exports.auth = async(req,res,next) =>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing!!'
            });
        }
        //verify the token...
        try{
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode; //hamne req.user ke andar is payload koo daal diya hai!!
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:'Token i s invalid!!'
            })
        }
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went Wrong!',
        });
    }
}
//isStudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType != "Student"){
            return res.status(401).json({
                succcess:false,
                message:'This is a Protectd route for Students Only!'
            })
        }
    }
    catch(error){
        return res.status(500).json({
            succcess:false,
            message:'User role cannot be verified, try again!'
        })
    }
    
}
//isInstructor
exports.insInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType!="Instructor"){
            return res.status(401).json({
                success: false,
                message:'This is a Protected Route for Instructor Only!'
            })
        }
    }
    catch(error){
        return res.status(500).json({
            status: false,
            message:'User role can \'t be verified!! try Again!'
        })
    }
}

// isAdmin

exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.User.accountType!="isAdmin"){
            return res.json({
                success:true,
                message:'This is protected route for Admin only...'
            })
        }
    }
    catch(error){
        return res.status(500).json({
            succcess:false,
            message:'Error from Server Side!'
        })
    }
} 