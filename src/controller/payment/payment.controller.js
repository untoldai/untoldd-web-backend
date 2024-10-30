
import { errorResponse, successResponse } from "../../utils/response.utils.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
export const paymentController = {};

import mongoose from 'mongoose';
import { message } from "../../constant/message.js";
import Payment from "../../models/payment.model.js";
import { createInstance } from "../../utils/payment.js";
paymentController.createPayment = async (req, res) => {
  try {
    const { order_id, amount, paymentMethod } = req.body;

    const newPayment = new Payment({
      order_id,
      amount,
      paymentMethod
    });

    const savedPayment = await newPayment.save();
    return successResponse(res, 201, savedPayment, "Payment created successfully");

  } catch (error) {
    return errorResponse(res, 500, message.SERVER_ERROR, error);
  }
};

// Update an existing payment
paymentController.updatePayment = async (req, res) => {
  const { paymentId } = req.params;
  const updates = req.body;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return errorResponse(res, 404, "Payment not found");

    }

    Object.assign(payment, updates);
    const updatedPayment = await payment.save();

    return res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      payment: updatedPayment
    });
  } catch (error) {
    return errorResponse(res, 500, message.SERVER_ERROR, error);
  }
};


paymentController.PaymentCheckout = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return errorResponse(res, 400, "Request body is empty");
    }

    const { amount, orderId } = req.body;

    // Validate amount
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return errorResponse(res, 400, "Invalid amount");
    }

    // Create payment order options
    const options = {
      amount: amount * 100, // Assuming amount is in rupees, converting to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    // Create the payment order
    createInstance.orders.create(options, async (error, order) => {
      if (error) {
        console.error("Payment order creation error:", error);
        return errorResponse(res, 500, "Failed to create payment order");
      }

      // Generate unique IDs
      const paymentId = crypto.randomBytes(10).toString("hex");
      const signatureId = crypto.randomBytes(10).toString("hex");

      // Create a new payment record
      const newPayment = await Payment.create({
        user_id: req.user._id,
        transactionId: order.id,
        amount: amount,
        order_id: orderId,
        paymentMethod: "UPI",
        paymentId: paymentId, // Include the generated paymentId
        signatureId: signatureId, // Include the generated signatureId
      });

      // Return success response
      return successResponse(res, 200, { order, newPayment }, "Payment order created successfully");
    });
  } catch (error) {
    console.error("Server error:", error);
    return errorResponse(res, 500, "Internal Server Error", error);
  }
};


paymentController.VerifyPayment = async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,

    } = req.body;
    // Validation checks
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return errorResponse(res, 403, "Missing required payment details");

    }

    // Retrieve Razorpay signature from headers
    // const razorpay_signature = req.headers["x-razorpay-signature"];
    // if (!razorpay_signature) {
    //   return res
    //     .status(204)
    //     .send(new ApiError(400, "Razorpay signature missing"));
    // }

    // Generate HMAC to verify the signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
    hmac.update(orderCreationId + "|" + razorpayPaymentId);
    const generated_signature = hmac.digest("hex");

    // Verify signature
    if (razorpaySignature !== generated_signature) {
      return errorResponse(res, 409, "Invalid signature verification")

    }
    // const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

    // shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    // const digest = shasum.digest("hex");
    // if (digest !== razorpaySignature)
    //   return res.status(400).json({ msg: "Transaction not legit!" });

    // Update payment details in database
    const updatePaymentDetails = await Payment.findOneAndUpdate(
      { transactionId: razorpayOrderId },
      {
        
        paymentId: razorpayPaymentId,
        signatureId: razorpaySignature,

        status: "COMPLETED",
      },
      { new: true }
    );

    // If no payment record found
    if (!updatePaymentDetails) {
      return errorResponse(res, 404, "Payment record not found");

    }

    // Respond with success
    return successResponse(res, 200, updatePaymentDetails, "Payment verified successfully")

  } catch (error) {
    return errorResponse(res, 500, message.SERVER_ERROR, error);
  }
};
