import { Router } from "express";
import { cartController } from "../../../controller/cart/cart.controller.js";
import { verifyUserToken } from "../../../middleware/authtoken.middlware.js";
const router = Router();
router.post('/cart', verifyUserToken, cartController.addToCart);              // Add item to cart
router.delete('/cart', verifyUserToken, cartController.removeFromCart);       // Remove item from cart
router.get('/cart/:user_id', verifyUserToken, cartController.getCartItems);

export default router;