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


//delete SubSection..
exports.deleteSubSection = async (req,res) =>{
    try{
        //get subs Id
        const {sectionId,subSectionId}= req.body;
        //validate input
        if(!sectionId || !subSectionId){
            return res.status(401).json({
                success:false,
                message:"Can't be Fetch the subSection and sectionId.",
            })
        }
       
        //delete the subsection
        const deletedSubSection = await SubSection.findByIdAndDelete(sectionId);
        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: 'SubSection not found.',
            });
        }
        //response
        return res.status(200).json({
            success:true,
            message:'SubSection has been Successfully deleted!!',
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error Occured in SubSection Block!!",
            error:error.message,
        })
    }
}

//HW: updateSubSection
exports.updateSubSection = async(req,res)=>{
    try {
        // 1. Extract Parameters
        const { sectionId, subSectionId } = req.body;
    
        // 2. Validate Input
        if (!sectionId || !subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'SectionId and subSectionId are missing!!',
            });
        }
    
        // 3. Find the Subsection
        const updateSubSection = await subSection.findById(subSectionId);
        
        // 4. Check Existence
        if (!updateSubSection) {
            return res.status(404).json({
                success: false,
                message: 'Subsection not found!',
            });
        }
    
        // 5. Update the Subsection
        // Assuming req.body has the fields to update
        Object.assign(updateSubSection, req.body);
        await updateSubSection.save();
    
        // 6. Respond to Client
        return res.status(200).json({
            success: true,
            message: 'Subsection updated successfully!',
            data: updateSubSection,
        });
        
    } catch (error) {
        // 7. Error Handling
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}







