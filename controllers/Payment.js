const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/template/courseEnrollmentEmail");



//capture the payment and initialise the Razorpay Order
exports.capturePayment = async (req,res)=>{
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
    //order creation
    //return res
}
