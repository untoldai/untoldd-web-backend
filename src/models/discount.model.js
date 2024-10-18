import mongoose from 'mongoose';
const { Schema } = mongoose;

// Discount Schema
const discountSchema = new Schema({
    discountType: {
        type: String,
        enum: ['Referral', 'Coupon', 'Product'],
        required: [true, 'Discount type is required'],
        description: "Type of the discount"
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount value must be a positive number'],
        description: "Percentage or amount of the discount"
    },
    code: {
        type: String,
        required: function() { return this.discountType === 'Coupon'; }, // Coupon needs a code
        description: "Coupon code if applicable"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: function() { return this.discountType === 'Product'; }, // Only required for product discount
        description: "The product the discount applies to"
    },
    referralUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { return this.discountType === 'Referral'; }, // Only required for referral discount
        description: "User who referred another"
    },
    usageLimit: {
        type: Number,
        default: 1, // Defaults to one-time use unless otherwise specified
        description: "How many times the discount can be used"
    },
    expiresAt: {
        type: Date,
        description: "Expiration date for the discount"
    }
}, { timestamps: true });

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
