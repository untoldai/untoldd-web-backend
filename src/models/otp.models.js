import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    otp: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    token: {
        type: String,
        required: true,

    },
    is_used: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    expiry_time: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true,
    },

}, { timestamps: true });

export const OtpModal = mongoose.model("OtpModal", otpSchema);