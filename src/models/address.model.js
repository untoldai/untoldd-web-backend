import mongoose from "mongoose";

// Create the schema for the user address
const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },

    streetAddress: {
        type: String,
        required: true,
        trim: true
    },
    apartmentNumber: {
        type: String,
        required: false,
        trim: true // Optional field for apartment or suite numbers
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
       
    },
    country: {
        type: String,
        required: true,
        enum: [ // Enum for common countries
            'USA',
            'INDIA',
            'UK',
            'Australia',
            'Germany',
            'France',
            'Other'
        ]
    },
    phone: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 phone format
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    addressType: {
        type: String,
        required: true,
        enum: ['Home', 'Work', 'Other'], // Specify type of address
        default: 'Home'
    },
    isDefault: {
        type: Boolean,
        default: false // Flag to indicate if this is the default address
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update `updatedAt` before saving
addressSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the model from the schema
const Address = mongoose.model('Address', addressSchema);

export default Address
