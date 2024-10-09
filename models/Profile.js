const mongoose = required("mongoose");
const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
        trim:true,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:Number,
        trime:true,
    }
});

module.exports = mongoose.model("profile",profileSchema);