import { asyncHanlder } from "../../utils/asyncHandler.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";
import Cart from "../../models/cart.model.js";
import { message } from "../../constant/message.js";
export const cartController = {};

cartController.addToCart = async (req, res) => {
    const { user_id, productId, quantity, totalAmount } = req.body;

    try {
        const existingCartItem = await Cart.findOne({ user_id, productId });

        if (existingCartItem) {
            // Update quantity and total amount if item already exists
            existingCartItem.quantity += quantity;
            existingCartItem.totalAmount += totalAmount;
            await existingCartItem.save();
            return successResponse(res, 200, {}, 'Cart updated');
        }

        const newCartItem = new Cart({ user_id, productId, quantity, totalAmount });
        await newCartItem.save();
        return successResponse(res, 201, newCartItem, 'Item added to cart');
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};

// Remove item from cart
cartController.removeFromCart = async (req, res) => {
    const { user_id, productId } = req.body;

    try {
        const result = await Cart.deleteOne({ user_id, productId });

        if (result.deletedCount === 0) {
            return errorResponse(res, 404, {}, 'Item not found in cart')
        }

        return successResponse(res, 200, {}, 'Item removed from cart');
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};

// Get cart items
cartController.getCartItems = async (req, res) => {
    const { user_id } = req.params;

    try {
        const cartItems = await Cart.find({ user_id }).populate('productId');

        if (cartItems.length === 0) {
            return successResponse(res, 404, {}, 'Cart is empty');;
        }

        return successResponse(res, 200, cartItems, message.FETCH_SUCCESS);
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};
