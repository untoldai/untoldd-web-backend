import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        description: "The product that this review belongs to"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        description: "The user who made the review"
    },
    rating: {
        type: Number,
        required: true,
        min: [0, 'Rating cannot be below 0'],
        max: [5, 'Rating cannot exceed 5'],
        description: "The rating given by the user (0-5)"
    },
    comment: {
        type: String,
        maxlength: [500, 'Comment must be less than 500 characters'],
        description: "Optional review comment"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        description: "The date when the review was created"
    }
}, { timestamps: true });

// Index for efficient querying
reviewSchema.index({ product: 1, user: 1 }); // Querying reviews by product and user

const Review = mongoose.model('Review', reviewSchema);

export default Review;
