const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },  
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});
//code yaha start hoga otp wala...

//function to send emaol...

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion",otp);
        console.log("Email Send Successfully!!",mailResponse);


    }
    catch(error){
        console.log("Error Occcured at SendVerificationEmail",error);
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

model.exports = mongoose.model("OTP",OTPSchema);

