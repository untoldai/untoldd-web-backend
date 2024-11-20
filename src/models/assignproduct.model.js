import mongoose, { Schema } from 'mongoose';

const PurchaseSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Customer who made the purchase
      ref: 'User',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId, // Product that was purchased
      ref: 'Product',
      required: true,
    },
    assign_by: {
        type: mongoose.Schema.Types.ObjectId, // Customer who made the purchase
        ref: 'User',
        required: true,
      },
    assignment_token: {
      type: String, // The token associated with the influencer's referral link
      required: true,
    },
    purchase_amount: {
      type: Number, // Amount spent on the purchase
      required: false,
    },
    commission: {
      type: Number, // Commission earned by the influencer
      default: 15,
    },
    purchase_date: {
      type: Date,
      default: Date.now,
    },
    is_visible:{
        type:Boolean,
        default:true
    }
  },
  {
    timestamps: true,
  }
);
PurchaseSchema.index({ user_id: 1 }); // Index on `user_id` for fast lookups by customer
PurchaseSchema.index({ product_id: 1 }); // Index on `product_id` for fast lookups by product
PurchaseSchema.index({ assignment_token: 1 }); // Index on `assignment_token` for fast lookups by influencer
PurchaseSchema.index({ purchase_date: -1 }); // Index on `purchase_date` for fast sorting by date (descending)

const ProductAssign = mongoose.model('Purchase', PurchaseSchema);

export default ProductAssign;
