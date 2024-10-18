import jwt from "jsonwebtoken";
import { asyncHanlder } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyUserToken = asyncHanlder(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.userAuthToken || req.header('Authorization')?.replace("Bearer ", "").trim();

     

        if (!token) {
            return next(new ApiError(401, "Authorization token is required"));
        }
        
        // Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
        
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            return next(new ApiError(404, "User not found, invalid token"));
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);

        if (error.name === 'TokenExpiredError') {
            return next(new ApiError(401, "Token has expired, please log in again"));
        } else if (error.name === 'JsonWebTokenError') {
            return next(new ApiError(401, "Invalid token, please log in again"));
        }

        next(new ApiError(400, error.message));
    }
});

export const verifyAdminToken = asyncHanlder(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.userAuthToken || req.header('Authorization')?.replace("Bearer ", "").trim();

     

        if (!token) {
            return next(new ApiError(401, "Authorization token is required"));
        }
        
        // Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
        
        
        const admin = await User.findOne({_id:decodedToken?._id,is_admin:true}).select("-password -refreshToken");
        if (!admin) {
            return next(new ApiError(404, "Admin not found, invalid token"));
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error(error);

        if (error.name === 'TokenExpiredError') {
            return next(new ApiError(401, "Token has expired, please log in again"));
        } else if (error.name === 'JsonWebTokenError') {
            return next(new ApiError(401, "Invalid token, please log in again"));
        }

        next(new ApiError(400, error.message));
    }
});