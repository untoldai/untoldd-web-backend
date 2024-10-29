
import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    is_manufature: {
        type: Boolean,
        default: false
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name must be less than 100 characters']
    },
    type: {
        type: String,
        required: [true, 'Product type is required'],
        enum: ['Kids Wear', 'Cosmetic', 'Electronics', 'Apparel', 'Home', 'Books', 'Other', 'Consumable'],
        description: 'Defines the type of product, e.g., Kids Wear, Cosmetic, Electronics, etc.'
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: [
            'Boy',    // Specific to Kids Wear
            'Girl',
            'both',             // Could be a category under Kids Wear
            'Cosmetics',
            'perfume',        // Specific to Cosmetic
            'Skincare',         // Could be a sub-category under Cosmetics
            'Electronics',
            'Home',
            'Books',
            'Other',
            'Groceries'
        ],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description must be less than 1000 characters']
    },

    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock quantity must be a positive number']
    },
    brand: {
        type: String,
        trim: true,
        maxlength: [50, 'Brand name must be less than 50 characters']
    },
    sku: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'SKU is required']
    },
    video_url: {
        type: String,
        trim: true,

    },
    images: [
        {
            url: {
                type: String,
                required: false
            },
            altText: {
                type: String
            }
        }
    ],
    tags: {
        type: [String]
    },
    // Conditional field for Consumable products (like oil, flour, etc.)
    quantity: {
        type: Number,
        required: function () {
            return this.type === 'Consumable';
        },
        min: [0, 'Quantity must be a positive number'],
        description: 'Applicable only for consumable products, defines quantity in kg, liters, etc.'
    },
    unit: {
        type: String,
        required: function () {
            return this.type === 'Consumable';
        },
        enum: ['kg', 'liter', 'gram', 'ml', 'unit'],
        description: 'Defines the unit of measurement for consumables like kg, liter, etc.'
    },
    variants: [
        {
            color: {
                type: String,
                description: "Color variant of the product"
            },
            size: {
                type: String,
                description: "Size variant of the product"
            },
            additionalPrice: {
                type: Number,
                default: 0,
                description: "Additional cost for this variant"
            }
        }
    ],
    // Product-specific fields (can be used for electronics and similar products)
    warranty: {
        type: String,
        description: 'Warranty information for electronics or applicable products'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Virtual: Calculate discount price (assuming a discount structure exists)
productSchema.virtual('discountedPrice').get(function () {
    if (this.discount && this.discount.discountValue) {
        return this.price - (this.price * (this.discount.discountValue / 100));
    }
    return this.price;
});

// Indexes for efficient querying
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
