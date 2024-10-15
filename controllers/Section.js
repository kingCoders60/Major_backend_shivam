const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try {
        // Data fetch
        const { sectionName, courseId } = req.body;

        // Data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }

        // Create section
        const newSection = await Section.create({ sectionName });

        // Update course with section object ID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true }
        ).populate('courseContent'); // Populate sections here

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Section created successfully',
            data: updatedCourseDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Server Error',
            error: error.message,
        });
    }
};

exports.updateSchema = async (req,res)=>{
    try{
        //data input,
        const {sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId,sectionName,{new:true}); //new:true -> aapko updated data milega...
        //return data
        return res.status(200).json({
            success:true,
            message:'Section Updtaed Successfully!!',
            section
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Unable to Update Section, please try again',
            error:error.message,
        })
    }
}
exports.deleteSection = async (req,res) => {
    try{
        //get id
        const {sectionId}=req.prams
        //use function findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //Todo: we need to delete the entry from the schema..
        //return response...
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully!!",
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Unable to Update Section, please try again!',
            error:error.message,
        });
    }
}