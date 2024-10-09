const mongoose = required("mongoose");
const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    rating:{
        type:Number,
    },
    review :{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema);