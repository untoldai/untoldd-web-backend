import { Router } from "express";
import { verifyUserToken } from "../../../middleware/authtoken.middlware.js";
import { orderController } from "../../../controller/order/order.controller.js";
const router = Router();

router.post('/create', verifyUserToken, orderController.createOrder);
router.post('/update', verifyUserToken, orderController.updateOrder);


export default router;