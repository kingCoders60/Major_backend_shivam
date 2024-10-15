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

    const options={
        amount: amount*100,
        currency,
        reciept:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
    };
    try{
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })
    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        })
    }
};


exports.verifySignature = async(req,res)=>{
    const webhookSecret = "12345678";
    const signature = req.headers["x-raqzorpay-signature"];
    const shasum= crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature == digest){
        console.log("Payment is Authorized");
        const {courseId,userId}=req.body.payload.payment.entity.notes

        try{
            //fullfill the action

            //find the course and enroll 
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true}
            );
            if(!enrolledCourse){
                return res.status(500).json({

                });
            }
            console.log(enrolledStudent);
            const enroledStudent = await User.findOneAndUpdate(
                {_id:courseId},
                {$push:{courses:courseId}},
                {new:true}
            );
            console.log()
            //mail send kardo ab..
            let info = await transporter.sendMail({
                from: 'StudyNotion || CodeHelp - by Babbar',
                to: `${email}`,
                subject: `${title}`,
                html: `${body}`,
                })
                console.log(info);
                return info;

                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Congratulations from CodeHelp",
                    "Congratulations, you are onboarded into new CodeHelp Course",
                    );

                    console.log(emailResponse);
                    return res.status.json({
                        success:true,
                        
                    })
                    I

                
        }
        catch(error){

        }
    }

};