const mongoose = required("mongoose");
const courseSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    }    ,
    courseDescription:{
        type:String
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWill:{
        type:String,
    },
    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    },
    ratingAndReviews:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    },
    price:{
        type:Number,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }
});


module.exports = mongoose.model("Course",courseSchema);
 
