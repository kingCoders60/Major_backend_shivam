const SubSection = require("../models/SubSection");
const Section = require("../models/Section")
const {uploadImageToCloudinary}=require("../utils/imageUploader");
//create SubSection 

exports.createSubsection = async (req,res) =>{
    try{
        //fetch data from request body
        const {sectionId,title,timeDuration,description,videoUrl} = req.body;
        //extract file/video
        //validation
        if(!sectionId || !title || !timeDuration || !description || !videoUrl){
            return res.status(400).json({
                success:false,
                message:'Missing Properties..',
            })  
        }
        //upload video to cloudinary..fetch secure url
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        //create a sub-section
        const subSecitonDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            videoUrl:uploadDetails.secure_url,
        })
        //update section with this subsection
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
            {$push:{
                subSection:subSecitonDetails._id,
            }},
            {new:true}
            //section ke andar sub section ka data kaise store hoga?? id ke form me store hoga..!
        );
        //HW: log Updated Section here, after adding populate quere
        //return response..

        return res.status(200).json({
            success:true,
            message:"Sub Section Created SuccessFully!!",
            updatedSection,
        })
    } 
    catch(error){
        return res.status(500).jso({
            success:false,
            message:"Internal Error!!",
            error:error.message,
        })
    }
}

//HW: updateSubSection
//delete SubSection..