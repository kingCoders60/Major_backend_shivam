 const ratingAndReview = require("../models/RatingAndReview");
 const Course= require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");


 exports.createRating = async(req,res)=>{
    try{
        //get user details
        const userId = req.user.id;
        //fetch data from req,body
        const {rating,review,courseId}=req.body;
        //check if user is existed
        const courseDatails = await Course.findOne(
            {_id:courseId,
                studentsEnrolled:{$elemMatch:{$eq:userId}},
            }
        )
        if(!courseDatails){
            return res.status(400).json({
                success:false,
                message:"Student is not enrolled in any course..",
            });
        }
        //check if user has already reviewed
         const alreadyReviewed = await RatingAndReview.findOne({
            _id:userId,
            course:courseId,
         });
        //create rating and revire
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:`{user} already reviewed!!!`,
            })
        }
        //update course rating/review
        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId,
        });
        //update this course with this rating review
        const updatedCourseDetails = await Course.findByIdAndUpadate(courseId,{
            $push:{
                ratingAndReviews: ratingReview._id,
            }
        },
        {new:true});
        console.log(updatedCourseDetails);
        //ewruen response..
        return res.status(200).json({
            success:true,
            message:"Ratinf and Review Successfully",
            ratingReview,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error Occured In RatingAndReview page..!',
            error:error.message
        })
    }
 }

 //getAverage Rating...

 exports.getAverageRating = async(req,res)=>{
    try{
        //get course id
        const courseId = req.body.courseId;
        //calculate the avg rating

        const result = await  RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId), //aaesa entry find out karo jiska entry iske equal hai
                }
            },
            {
                $group:{
                    _id:null,//isme jitne bhi entry aaya tha sab aa jayega..
                    
                }
            }
        ])
    }catch(error){

    }
 }