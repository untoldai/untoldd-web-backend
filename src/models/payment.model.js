import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: [true, 'Order ID is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    paymentMethod: {
        type: String,
        enum: ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', "ONLINE"],
        required: [true, 'Payment method is required']
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING',
        description: "Payment status"
    },
    transactionId: {
        type: String,
        description: "Unique transaction ID from the payment gateway"
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        description: "Date when the payment was made"
    }
}, { timestamps: true });

// Indexes for efficient querying
paymentSchema.index({ order_id: 1 }); // Index on order_id for order-specific payments

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
