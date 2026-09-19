const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: { type: String, enum: ['user', 'admin', 'bot'], required: true },
    message: { type: String },
    image: { type: String }, // Cloudinary URL
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' },
    createdAt: { type: Date, default: Date.now }
});

const chatSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        messages: [messageSchema],
        status: { type: String, enum: ['open', 'resolved', 'pending'], default: 'open' },
        lastMessage: { type: Date, default: Date.now },
        unreadCountAdmin: { type: Number, default: 0 },
        unreadCountUser: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
