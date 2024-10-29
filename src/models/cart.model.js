import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },

    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required']
    },

}, { timestamps: true });

// Indexes for efficient querying
cartSchema.index({ user_id: 1 }); // Index on userId for user-specific orders
cartSchema.index({ 'productId': 1 }); // Index on productId for product-based queries

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
