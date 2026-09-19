const mongoose = require('mongoose');

const accountSchema = mongoose.Schema(
    {
        platform: { type: String, required: true }, // e.g., Instagram, Twitter, Facebook
        type: { type: String, required: true }, // e.g., Aged, High Follower, Verified
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 1 },
        image: { type: String }, // URL to screenshot
        media: [{ type: String }], // Array of all uploaded images/videos
        credentials: { type: String, required: true }, // Encrypted or plain text for the buyer
        badges: [{ type: String }], // e.g., ['verified', 'aged', 'premium']
        quality: { type: Number, default: 100 }, // 0 to 100
    },
    { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
