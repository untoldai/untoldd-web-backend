import { Router } from "express";
import { verifyAdminToken, verifyUserToken } from "../../../middleware/authtoken.middlware.js";
import { orderController } from "../../../controller/order/order.controller.js";
const router = Router();

router.post('/create', verifyUserToken, orderController.createOrder);
router.post('/update', verifyUserToken, orderController.updateOrder);
router.get("/users/orders",verifyUserToken,orderController.getOrderListForUser);
router.get("/admin/orders",verifyAdminToken,orderController.getOrderListForAdmin);
router.get("/users/order-details",verifyUserToken,orderController.getSingleOrderDetails);


export default router;