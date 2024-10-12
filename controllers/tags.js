const Tags = require("../models/tags");

const createTag = async (req, res) => {
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
        const tagDetails = await Tags.create({
            description: descripiton,
            name: name,
        })
        console.log(tagDetails);
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

//get all tags
exports.showAlltags = async (req, res) => {
    try {
        const allTags = await Tags.find({}, { name: true, description: true }); //hamko sare tags lake do aur usme description aur name true haiS
        res.status(200).json({
            success: true,
            message: "All tags return Successfull",
            allTags,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}