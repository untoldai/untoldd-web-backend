import { asyncHanlder } from "../../utils/asyncHandler.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";
import Order from "../../models/order.model.js";
export const orderController = {};


import { message } from "../../constant/message.js";

// Create a new order
// Create a new order
orderController.createOrder = async (req, res) => {
    try {
        const { products, totalAmount } = req.body;

        // Validate input
        if (!products || products.length === 0 || !totalAmount) {
            return errorResponse(res, 400, 'User ID, products, and total amount are required.');
        }

        // Create a new order instance
        const newOrder = new Order({
            user_id: req.user._id,
            products,
            totalAmount
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        return successResponse(res, 201, savedOrder, 'Order has been placed successfully.');
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};


// Update an existing order
orderController.updateOrder = async (req, res) => {
    const { orderId } = req.query; // Get the order ID from the request parameters
    const updates = req.body; // Get the updates from the request body

    try {
        // Check if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return errorResponse(res, 404, "Order not found");

        }

        // Update the order
        Object.assign(order, updates);
        const updatedOrder = await order.save();
        return successResponse(res, 200, updatedOrder, 'Order updated successfully');

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};
