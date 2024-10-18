import { message } from "../../constant/message.js";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHanlder } from "../../utils/asyncHandler.js";
import { generateRandomId } from "../../utils/random.generator.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";
import { validateRegisterUser } from "../../validation/auth.validation.js";
let authController = {};
async function generateAccessRefreshToken(user) {
    try {



        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        const accessToken = await user.generateAccessToken();

        return accessToken;
    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating access token", error)
    }
}
authController.registerUser = asyncHanlder(async (req, res) => {
    try {

        const { firstname, lastname, email, password, phone, dob } = req.body;


        const isValid = await validateRegisterUser(req.body);

        if (isValid.success === false) {

            return errorResponse(res, 400, isValid.error, message.INVALID);
        }
        const isUserExists = await User.findOne({
            $or: [

                { 'contact.phone': phone }
            ]
        });
        if (isUserExists) {
            return successResponse(res, 409, {}, "Email or mobile already exists")
        }
        const newUser = await User.create({
            name: firstname + lastname,
            user_id: generateRandomId(firstname.toUpperCase()),
            contact: {
                phone: phone,
                email: email
            },
            personal_details: {
                first_name: firstname,
                last_name: lastname,
                dob: dob
            },
            password: password,
            is_user: true,
            is_admin: false,
            is_Staff: false,
            is_manufacturer: false,

        });
        if (!newUser) {
            return errorResponse(res, 500, "Something went wrong while creating new user")
        }
        if (newUser) {
            const accessToken = await generateAccessRefreshToken(newUser);

            return successResponse(res, 201, { newUser, accessToken }, "New user register successfully");
        }


    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
});

authController.userLogin = asyncHanlder(async (req, res) => {
    try {
        const { user_id, email, password } = req.body;
        if (!user_id && !email) {
            return errorResponse(res, 422, message.INVALID);
        }
        if (!password || password === " ") {
            return errorResponse(res, 422, "Password is required");
        }
        const isUserExists = await User.findOne({
            $and: [
                { is_admin: true },
                {
                    $or: [
                        { 'contact.email': email },
                        { 'user_id': email }
                    ]
                }
            ]
        });
        if (!isUserExists) {
            return errorResponse(res, 403, "Userid or email not found ");
        }
        const isPasswordMatch = await isUserExists.isPasswordCorrect(password);
        if (!isPasswordMatch) {
            return errorResponse(res, 403, "Password doest not matched");

        }
        const accessToken = await generateAccessRefreshToken(isUserExists);

        const data = {
            id: isUserExists._id,
            user_id: isUserExists.user_id,
            email: isUserExists.contact.email,
            name: isUserExists.name,
            is_admin: isUserExists.is_admin,
            is_user: isUserExists.is_user,
            is_manufacturer: isUserExists.is_manufacturer,
            is_Staff: isUserExists.is_Staff
        };
        return successResponse(res, 200, { data, accessToken }, "Login Successfully");

    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, message.SERVER_ERROR);
    }
})
// controller for get current login User profile
authController.getLoginUserProfile = asyncHanlder(async (req, res) => {
    return successResponse(res, 200, req.user, message.FETCH_SUCCESS);
})
authController.updateProfileDetails = asyncHanlder(async (req, res) => {
    try {
        if (!req.user) {
            return errorResponse(res, 404, "Un authorized")
        }
        const { first_name, last_name, dob } = req.body;
        if (!first_name || !last_name) {
            return errorResponse(res, 422, message.INVALID);
        }
        await User.findByIdAndUpdate(req.user._id, {
            'personal_details.first_name': first_name,
            'personal_details.last_name': last_name,
            'personal_details.dob': dob,
        }, { new: true });
        return successResponse(res, 200, {}, "User profile updated successfully");

    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, message.SERVER_ERROR);
    }
})

authController.userChangePassword = asyncHanlder(async (req, res) => {
    try {
        if (!req.user) {
            return errorResponse(res, 404, "Un authorized")
        }
        const { old_password, new_password } = req.body;
        if (!old_password || old_password === "") {
            return errorResponse(res, 409, 'Old Password is required');
        }
        if (!new_password || new_password === "") {
            return errorResponse(res, 409, 'Old Password is required');
        }
        const user = await User.findById(req.user._id);
        const isPaswordMatch = await user.isPasswordCorrect(old_password);
        if (!isPaswordMatch) {
            return errorResponse(res, 401, "Old password doesn't match");
        }
        user.password = new_password;
        await user.save();
        return successResponse(res, 200, "Password Changed successfully");
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, message.SERVER_ERROR);
    }
});


// login for admin 
authController.adminLogin = asyncHanlder(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return errorResponse(res, 422, message.INVALID);
        }
        if (!password || password === " ") {
            return errorResponse(res, 422, "Password is required");
        }

        const isUserExists = await User.findOne({
            $and: [
                { is_admin: true },
                {
                    $or: [
                        { 'contact.email': email },
                        { 'user_id': email }
                    ]
                }
            ]
        });

        if (!isUserExists) {
            return errorResponse(res, 403, "Email not found ");
        }
        const isPasswordMatch = await isUserExists.isPasswordCorrect(password);
        if (!isPasswordMatch) {
            return errorResponse(res, 403, "Password doest not matched");

        }
        const accessToken = await generateAccessRefreshToken(isUserExists);

        const data = {
            id: isUserExists._id,
            user_id: isUserExists.user_id,
            email: isUserExists.contact.email,
            name: isUserExists.name,
            is_admin: isUserExists.is_admin,
            is_user: isUserExists.is_user,
            is_manufacturer: isUserExists.is_manufacturer,
            is_Staff: isUserExists.is_Staff
        };
        return successResponse(res, 200, { data, accessToken }, "Login Successfully");

    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, message.SERVER_ERROR);
    }
})
authController.getLoginAdminProfile = asyncHanlder(async (req, res) => {
    if (!req.admin) {
        return next(new ApiError(404, "Admin not found"));
    }

    return successResponse(res, 200, req.admin, message.FETCH_SUCCESS);
});

authController.getAdminProfileDetails = asyncHanlder(async (req, res) => {
    try {

        const data = await User.findOne({ _id: req.admin._id, is_admin: true }).select(['-password', '-refreshToken']);
        return successResponse(res, 200, data, message.FETCH_SUCCESS);

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR);
    }
});
export default authController;