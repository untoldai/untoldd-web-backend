import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Social Media Schema
const socialMediaSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Link to the User/Influencer collection
        ref: 'User', // Assuming 'User' is the model for users/influencers
        required: true,
    },
    platform: {
        type: String, // e.g., Instagram, Twitter, etc.
        enum: ['Instagram', 'Twitter', 'Facebook', 'YouTube', 'LinkedIn'], // Can be extended to other platforms
        required: true,
    },
    accountId: { 
        type: String, // Social media platform-specific ID (e.g., Instagram user ID)
        required: true,
        unique: true, // Ensure unique account ID for each platform
    },
    followersCount: {
        type: Number,
        default: 0, // Default to 0 if no data is available
    },
    followingCount: {
        type: Number,
        default: 0, // Default to 0 if no data is available
    },
    engagement: {
        likes: {
            type: Number,
            default: 0, // Default to 0 if not tracking
        },
        comments: {
            type: Number,
            default: 0, // Default to 0 if not tracking
        },
        posts: {
            type: Number,
            default: 0, // Default to 0 if not tracking
        },
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp when the social media account was added
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Timestamp when the social media account details were last updated
    }
});

// Create the model for Social Media
const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);

export default SocialMedia;
