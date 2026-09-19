const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        account: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Account' },
        orderId: { type: String, required: true, unique: true },
        paymentProof: { type: String }, // Cloudinary URL to screenshot
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'processing', 'completed', 'cancelled']
        },
        paymentMethod: { type: String, required: true, default: 'manual' },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
