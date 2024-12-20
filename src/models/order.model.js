import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    products: [{
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
        unit: {
            type: String,
        },
        variants: {
            type: String
        },
        price: {
            type: Number
        }
    }],
    address_id:{
        type: Schema.Types.ObjectId,
        ref: 'Address',
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required']
    },
    orderDate: {
        type: Date,
        default: Date.now,
        description: "Date when the order was placed"
    },
    status: {
        type: String,
        enum: ['CREATED', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCEL'],
        default: 'CREATED',
        description: "Order status"
    }
}, { timestamps: true });

// Indexes for efficient querying
orderSchema.index({ user_id: 1 }); // Index on userId for user-specific orders
orderSchema.index({ 'products.productId': 1 }); // Index on productId for product-based queries

const Order = mongoose.model('Order', orderSchema);

export default Order;
