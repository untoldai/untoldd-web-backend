import { asyncHanlder } from "../../utils/asyncHandler.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";
import Order from "../../models/order.model.js";
export const orderController = {};


import { message } from "../../constant/message.js";
import mongoose from "mongoose";
import Payment from "../../models/payment.model.js";

// Create a new order
// Create a new order
orderController.createOrder = async (req, res) => {
    try {
        const { products, totalAmount, address_id } = req.body;

        // Validate input
        if (!products || products.length === 0 || !totalAmount) {
            return errorResponse(res, 400, 'User ID, products, and total amount are required.');
        }

        // Create a new order instance
        const newOrder = new Order({
            user_id: req.user._id,
            products,
            totalAmount,
            address_id
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

orderController.getOrderListForUser = asyncHanlder(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const orders = await Order.aggregate([
            {
                $match: { user_id: new mongoose.Types.ObjectId(req.user._id) } // Match orders by user ID
            },
            {
                $unwind: '$products' // Deconstruct the products array
            },
            {
                $lookup: {
                    from: 'products', // The name of the Product collection
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } // Optional
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    orderDate: 1,
                    status: 1,
                    'products.quantity': 1,

                    'productDetails.name': 1,
                    'productDetails.images': { $arrayElemAt: ['$productDetails.images', 0] }, // Get the first image
                    'productDetails.description': 1,
                }
            },
            {
                $skip: skip // Skip for pagination
            },
            {
                $limit: limit // Limit for pagination
            },
            {
                $sort: { orderDate: -1 }
            }
        ]);


        // Count total active products for pagination
        const total_data = await Order.countDocuments({ user_id: req.user._id });

        // Calculate total pages
        const total_pages = Math.ceil(total_data / limit);

        // Build pagination metadata
        const pagination = {
            per_page: limit,
            current_page: page,
            first_page: 1,
            last_page: total_pages,
            total_data: total_data,
            next_page_url: page < total_pages ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page + 1}&limit=${limit}${category ? `&category=${category}` : ''}` : null
        };

        // Send the paginated response with products and pagination metadata
        return successResponse(res, 200, { orders, pagination }, message.FETCH_SUCCESS);
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
})

orderController.getOrderListForAdmin = asyncHanlder(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const orders = await Order.aggregate([

            {
                $unwind: '$products' // Deconstruct the products array
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $lookup: {
                    from: "addresses", // Assumed that "address" is your collection for addresses
                    localField: "address_id",
                    foreignField: "_id",
                    as: "orderAddress"
                }
            },
            {
                $lookup: {
                    from: 'products', // The name of the Product collection
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },

            {
                $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } // Optional
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    orderDate: 1,
                    status: 1,
                    'userDetails': 1,
                    'products.quantity': 1,

                    'productDetails.name': 1,
                    'productDetails.images': { $arrayElemAt: ['$productDetails.images', 0] }, // Get the first image
                    'productDetails.description': 1,
                    "orderAddress": 1,
                }
            },
            {
                $skip: skip // Skip for pagination
            },
            {
                $limit: limit // Limit for pagination
            },
            {
                $sort: { orderDate: -1 }
            }
        ]);


        // Count total active products for pagination
        const total_data = await Order.countDocuments();

        // Calculate total pages
        const total_pages = Math.ceil(total_data / limit);

        // Build pagination metadata
        const pagination = {
            per_page: limit,
            current_page: page,
            first_page: 1,
            last_page: total_pages,
            total_data: total_data,
            next_page_url: page < total_pages ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page + 1}&limit=${limit}${category ? `&category=${category}` : ''}` : null
        };

        // Send the paginated response with products and pagination metadata
        return successResponse(res, 200, { orders, pagination }, message.FETCH_SUCCESS);
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
})

orderController.getSingleOrderDetails = asyncHanlder(async (req, res) => {
    try {
        // Get the orderId from query parameters
        const orderId = req.query.orderId; // Ensure you're accessing the orderId correctly

        // Validate orderId
        if (!orderId || orderId === "") {
            return errorResponse(res, 204, "Order ID not found");
        }


        // Fetch order details using aggregation
        const orderDetails = await Order.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(orderId) // Ensure orderId is converted to ObjectId
                }
            },
            {
                $unwind: {
                    path: '$products', // Unwind the products array, if needed
                    preserveNullAndEmptyArrays: true // Optional, if you want to keep empty arrays
                }
            },
            {
                $lookup: {
                    from: "products", // Assumed that "product" is your collection for products
                    localField: 'products.productId',
                    foreignField: "_id",
                    as: "productsDetails"
                }
            },

            {
                $lookup: {
                    from: "addresses", // Assumed that "address" is your collection for addresses
                    localField: "address_id",
                    foreignField: "_id",
                    as: "orderAddress"
                }
            },
            {
                $lookup: {
                    from: "users", // Assumed that "users" is your collection for user details
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails",

                }
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    orderDate: 1,
                    status: 1,
                    'products.quantity': 1,
                    'products.price': 1,
                    'productsDetails.name': 1,
                    'productsDetails.images': { $arrayElemAt: ['$productsDetails.images', 0] }, // Get the first image
                    'productsDetails.description': 1,
                    "orderAddress": 1,
                    "userDetails": 1
                }
            },
        ]);

        // If no order details are found
        if (!orderDetails || orderDetails.length === 0) {
            return errorResponse(res, 404, "Order not found");
        }
        const payment = await Payment.findOne({ order_id: new mongoose.Types.ObjectId(orderId) });
        // Return the order details with a success response
        return successResponse(res, 200, { orderDetails, payment }, "Order details fetched successfully");

    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
});

orderController.updateOrderStatus = asyncHanlder(async (req, res) => {
    try {
        const { orderId, currentStatus } = req.query;
        const existingOrder = await Order.findOne({ _id:new  mongoose.Types.ObjectId(orderId) });
        
        existingOrder.status = currentStatus;
        await existingOrder.save();
        return successResponse(res, 200, {}, "Order Status updated successfully")
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
})