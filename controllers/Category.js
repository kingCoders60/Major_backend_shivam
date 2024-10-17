const Category = require("../models/Category");

const createCategory = async (req, res) => {
    try {
        const { name, descripiton } = req.body;
        //validation
        if (!name || !descripiton) {
            return res.status(401).json({
                success: false,
                message: "Correct name and description is requird!"
            })
        }
        //createEntry in dB
        const CategoryDetails = await Category.create({
            description: descripiton,
            name: name,
        })
        console.log(CategoryDetails);
        //print
        //return response...
        return res.status(200).json({
            success: true,
            message: 'Seccess!!'
        })
    } catch (error) {
        console.log(error);
    }
};

//get all Category
exports.showAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({}, { name: true, description: true }); //hamko sare Category lake do aur usme description aur name true haiS
        res.status(200).json({
            success: true,
            message: "All Category return Successfull",
            allCategory,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
//top selling course khud se karo..

exports.categoryPageDetails = async (req,res)=>{
    try{
        //
        selectedCategory  = await Category.findById(categoryId).populate("courses").exec();

        //validation
        if(!selectedCategory){
            return res.status(400).json({
                success:false,
                message:"Data Not found!!"
            });
        }

        const differentCategory = await Category.find({
            _id:{$ne:categoryId},
        }).populate("courses")
        .exec();

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategory,
            }
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error Ocuured in Category.js ",
            error:error.message,
        })
    }
}

//top selling course khud se karo..
