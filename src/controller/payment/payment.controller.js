import { asyncHanlder } from "../../utils/asyncHandler.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";
import Order from "../../models/order.model.js";
export const paymentController = {};

import mongoose from 'mongoose';
import { message } from "../../constant/message.js";
paymentController.createPayment = async (req, res) => {
    try {
        const { order_id, amount, paymentMethod } = req.body;

        const newPayment = new Payment({
            order_id,
            amount,
            paymentMethod
        });

        const savedPayment = await newPayment.save();

        return res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            payment: savedPayment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: error.message
        });
    }
};

// Update an existing payment
paymentController.updatePayment = async (req, res) => {
    const { paymentId } = req.params;
    const updates = req.body;

    try {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        Object.assign(payment, updates);
        const updatedPayment = await payment.save();

        return res.status(200).json({
            success: true,
            message: 'Payment updated successfully',
            payment: updatedPayment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating payment',
            error: error.message
        });
    }
};