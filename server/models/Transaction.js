const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        amount: { type: Number, required: true },
        type: { type: String, required: true, enum: ['deposit', 'purchase'] },
        status: { type: String, required: true, default: 'pending', enum: ['pending', 'approved', 'rejected', 'completed'] },
        paymentProof: { type: String }, // For deposits
        description: { type: String, required: true }
    },
    { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
