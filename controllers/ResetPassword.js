const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt")

exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from the body
        const email = req.body.email;
        //check user for this email, email validation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User Not Found!! 1234'
            })
        }
        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({ email: email }, {
            token: token,
            resetPasswordToken: Date.now() + 5 * 60 * 1000,
        },
            { new: true }//isse updated details return hota hai details mein
        )
        //create url

        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing url
        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);
        //return response
        return res.json({
            success: true,
            message: 'Email Sent Successfully!'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong While reset!',
        })
    }
}


//resetPassword

exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const { password, confirmPassword, token } = req.body;
        //validation
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: 'Password Not matching'
            });
        }
        //get userdetails from db using token
        const userDetails = await user.findOne({ token: token });
        //if no entry  - invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: 'Token is Invalid!',
            });
        }
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: 'Token is expired..please regenerate your token',
            });

        }
        //token time check
        //hash pwd
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        );
        return res.json({
            success: true,
            message: 'Pasword Reset Successfully!!',
        })
        //pwd update
        //return response
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Errror Occured in resetPwd',
        })
    }
}