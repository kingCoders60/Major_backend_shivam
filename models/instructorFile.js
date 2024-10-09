const mongoose = required("mongoose");
const nodemailer = required("nodemailer");
const Instructor = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    _id:{
        type:String,
        require:true,
        unique:true
    },
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true,
    }
})

const UserFile = mongoose.model("UserFile", Instructor);
module.exports = UserFile;