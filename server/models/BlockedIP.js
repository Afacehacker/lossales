const mongoose = require('mongoose');

const blockedIpSchema = mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    reason: { type: String, default: 'Blocked by Admin' }
}, {
    timestamps: true
});

const BlockedIP = mongoose.model('BlockedIP', blockedIpSchema);
module.exports = BlockedIP;
