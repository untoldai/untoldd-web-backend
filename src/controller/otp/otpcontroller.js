import path from "path";
import { OtpModal } from "../../models/otp.models.js";
import User from "../../models/user.model.js";
import { generateRandomOtp, generateRandomString } from "../../utils/random.generator.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";
import { fileURLToPath } from 'url';
import { sendmail } from "../../utils/mail.js";
import fs from "fs";
import ejs from "ejs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const otpController = {};

otpController.createOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return errorResponse(res, 400, "Email is required");
        }
        //check email is valid or not
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return errorResponse(res, 400, "Email is not valid");
        }
        const existingUser = await User.findOne({
            'contact.email': email
        });


        if (!existingUser) {
            return errorResponse(res, 400, "User Not Found");
        }
        //create otp
        const newOtp = new OtpModal();
        newOtp.user_id = existingUser._id;
        newOtp.otp = generateRandomOtp(4);
        newOtp.token = generateRandomString(10);
        newOtp.is_used = false;
        newOtp.is_verified = false;
        newOtp.expiry_time = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        newOtp.reason = "Forgot Password";
        await newOtp.save();

        let message = "Otp created successfully";
        //setup of ejs file 
        const templatePath = path.join(__dirname, "../../../views/email/otp.ejs");
        //check if file exists
        if (!fs.existsSync(templatePath)) {
            return errorResponse(res, 500, "Template file not found");
        }
        const emailtemplate = await ejs.renderFile(templatePath, { name: existingUser?.full_name, otp: newOtp.otp });

        //send email
        const mailResponse = await sendmail(email, "Otp for forgot password", emailtemplate);

        if (!mailResponse || !mailResponse.response) {
            await newOtp.delete();
            return errorResponse(res, 500, "Email not sent", mailResponse);
        }
        //send response
        //prepare message
        message = "Otp has been sent successfully to your register mail";
        return successResponse(res, 200, newOtp.token, message);

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error", error);
    }
}
otpController.verifyOtp = async (req, res) => {
    try {
        const { otp, token } = req.body;
        if (!otp || !token) {
            return errorResponse(res, 400, "Otp and token are required");
        }
        //check otp is valid or not
        const existingOtp = await OtpModal.findOne({ otp: otp, token: token });
        if (!existingOtp) {
            return errorResponse(res, 400, "Otp is not valid or expired");
        }
        //check otp is already used or not
        if (existingOtp.is_used) {
            return errorResponse(res, 400, "Otp is already used");
        }
        //check otp is already verified or not
        if (existingOtp.is_verified) {
            return errorResponse(res, 400, "Otp is already verified");
        }
        //update otp status
        existingOtp.is_verified = true;
        existingOtp.is_used = true;
        await existingOtp.save();

        //send response
        //delete this otp

        return successResponse(res, 200, existingOtp.token , "Otp has been verified successfully" );
    } catch (error) {
        return errorResponse(res, 500, "Internal Server Error", error);
    }
}