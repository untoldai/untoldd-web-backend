import { Router } from "express";
import { otpController } from "../../../controller/otp/otpcontroller.js";

const router = Router();
router.post("/send/forgot-password", otpController.createOtp);
router.post("/send/verify-otp", otpController.verifyOtp);

export default router;
