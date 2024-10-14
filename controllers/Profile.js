const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile= async (req,res) =>{
    try{
        //get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        //get userId,
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are manditory!!",
            })
        }
        //find Profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additinalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update Profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.contactNumber=contactNumber;
        //db me data kko update karna hai!!
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated Successfully!',
            profileDetails,
        })
    }
    catch(error){
        return res.status(500).json({

        })
    };
};

//delete Account...
//find -> how can we shedule this deletion operation (cronejob)
exports.deleteAccout = async (req,res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation
         const userDetails = await User.findById(id);
         if(!userDetails){
            return res.staus(400).json({
                success:false,
                message:'User Not found!',
            });
         }
        //delet profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //TODO: Unenrolled user freom all user courses
        //delete user
        await User.findByIdAndDelete({_id:id});
        
        //return response..
        return res.status(200).json({
            succcess:true,
            message:'User deleted successfully',
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occured!",
            error:error.message,
        })
    }
}

exports.getAllUserDetails = async (req,res) =>{
    try{
        //get id
        const id = req.user.id;
        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return response
        return res.status(200).json({
            sucess:true,
            message:"GetAll User Details Successfully!!",
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Some error Has occured",
            error:error.message,
        })
    }
};