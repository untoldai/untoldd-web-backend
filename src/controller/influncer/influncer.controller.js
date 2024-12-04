import { errorResponse, successResponse } from "../../utils/response.utils.js";
import { message } from "../../constant/message.js";
import User from "../../models/user.model.js";

const InfluncerController = {};
InfluncerController.updateProfile = async (req, res) => {
    try {
        const updateProfile = await User.findByIdAndUpdate(req.influncer._id, req.body, { new: true });
        if (!updateProfile) {
            return errorResponse(res, 404, "Profile Not found");
        }
        return successResponse(res, 200, updateProfile, "Profile updated successfully");
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
}

export default InfluncerController;