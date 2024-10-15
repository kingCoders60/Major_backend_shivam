const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/template/courseEnrollmentEmail");



//capture the payment and initialise the Razorpay Order
exports.capturePayment = async (req,res)=>{
    try{
        //get courseId and userId
        const {course_id}=req.body;
        const userId = req.user.body;
        //validation
        //validCourse
        if(!course_id){
            return res.json({
                success:false,
                message:'Please Provide Valid Course id'
            })
        };
        //valid CourseDetails
        let course;
        try{
            course = await Course.findById(course_id);
        }catch(error){
            return res.json({
                succcess:false,
                message:'Could not Find the Id'
            })
        }
        //user already pay for the same course
        const uid = new mongoose.Types.objectId(userId); //isme hamnme user id jo string me hai usko object id me store kar liya hai!!
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:'Student is already Enrolled!!'
            });
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
    //order create
    const amount = course.price;
    const currency = "INR";

    const optional={
        amount: amount*100,
        currency,
        reciept:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
    }
};
