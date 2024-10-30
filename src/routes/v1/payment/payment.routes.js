import { Router } from "express";
import { verifyUserToken } from "../../../middleware/authtoken.middlware.js";
import { paymentController } from "../../../controller/payment/payment.controller.js";
const router =Router();

router.post("/initate", verifyUserToken, paymentController.PaymentCheckout);
router.post("/create",verifyUserToken,paymentController.createPayment);
router.post("/update",verifyUserToken,paymentController.updatePayment);
router.post("/verify", verifyUserToken, paymentController.VerifyPayment);


export default  router;