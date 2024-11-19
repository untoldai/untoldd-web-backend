import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
// Define the user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
    },
    user_id: {
        type: String,
        required: [true, 'User ID is required'],
        lowercase: true,
        unique: true,
        trim: true,
    },
    contact: {
        code: {
            type: String,
            default: "+91",

        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            length: 10,
            match: [/^\d{10}$/, 'Phone number must be 10 digits'],
        },
        email: {
            type: String,
            required: [true, 'Email address is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, 'Email address is invalid'],
        }
    },
    personal_details: {
        first_name: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        last_name: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        dob: {
            type: Date,
            required: [true, 'Date of birth is required'],
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    avatar_url: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    is_user: {
        type: Boolean,
        default: true,
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
    is_manufacturer: {
        type: Boolean,
        default: false,
    },
    is_influncer: {
        type: Boolean,
        default: false,
    },
    is_Staff: {
        type: Boolean,
        default: false
    },
    is_user_login: {
        type: Boolean,
        default: true
    },
    is_influncer_login: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

// Indexes for efficient querying
userSchema.index({ user_id: 1 }); // Correcting index to match field name

userSchema.index({ 'contact.email': 1 }); // Index on email for quick lookups
userSchema.index({ 'contact.phone': 1 }); // Index on phone number for quick lookups

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to verify password
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Method to generate access token based on role
userSchema.methods.generateAccessToken = function () {
    let secretKey;
    let expireTime;
    if (this.is_admin) {
        secretKey = process.env.ACCESS_TOKEN_SECRET_ADMIN;
        expireTime = process.env.ACCESS_TOKEN_EXPIRES_ADMIN;
    } else if (this.is_influncer) {
        secretKey = process.env.ACCESS_TOKEN_SECRET_MANUFACTURER;
        expireTime = process.env.ACCESS_TOKEN_EXPIRES_MANUFACTURER;
    } else if (this.is_user) {
        secretKey = process.env.ACCESS_TOKEN_SECRET_USER;
        expireTime = process.env.ACCESS_TOKEN_EXPIRES_USER;
    } else {
        secretKey = process.env.ACCESS_TOKEN_SECRET_STAFF;
        expireTime = process.env.ACCESS_TOKEN_EXPIRES_STAFF;
    }


    return jwt.sign(
        {
            _id: this._id,
            user_id: this.user_id,
            email: this.contact.email,
            roles: {
                is_admin: this.is_admin,
                is_influncer: this.is_influncer,
                is_user: this.is_user,
            },
        },
        secretKey,
        { expiresIn: expireTime }
    );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    let secretKey;
    let expireTime;
    if (this.is_admin) {
        secretKey = process.env.REFRESH_TOKEN_SECRET_ADMIN;
        expireTime = process.env.REFRESH_TOKEN_EXPIRES_ADMIN;
    } else if (this.is_influncer) {
        secretKey = process.env.REFRESH_TOKEN_SECRET_MANUFACTURER;
        expireTime = process.env.REFRESH_TOKEN_EXPIRES_MANUFACTURER;
    } else if (this.is_user) {
        secretKey = process.env.REFRESH_TOKEN_SECRET_USER;
        expireTime = process.env.REFRESH_TOKEN_EXPIRES_USER;
    }
    else {
        secretKey = process.env.REFRESH_TOKEN_SECRET_STAFF;
        expireTime = process.env.REFRESH_TOKEN_EXPIRES_STAFF;
    }
    return jwt.sign(
        {
            _id: this._id,
            user_id: this.user_id,

            roles: {
                is_admin: this.is_admin,
                is_influncer: this.is_influncer,
                is_user: this.is_user,
            },
        },
        secretKey,
        { expiresIn: expireTime }
    );
};

// Create a model from the schema
const User = mongoose.model('User', userSchema);

export default User;
