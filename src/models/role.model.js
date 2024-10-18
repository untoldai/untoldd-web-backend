import mongoose, { Schema } from 'mongoose';

// Define the role schema
const roleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        trim: true,
        uppercase: true,
        description: 'Role name must be a string and is required',
    },
    description: {
        type: String,
        trim: true,
        description: 'A brief description of the role',
    },
    permissions: [{
        type: String,
        description: 'List of permissions associated with the role',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        description: 'Timestamp when the role was created',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        description: 'Timestamp when the role was last updated',
    },
});

// Middleware to update the updatedAt field
roleSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
});


const Role = mongoose.model('Role', roleSchema);
export default Role;
