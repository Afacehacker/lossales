const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    bankName: {
        type: String,
        default: 'Rubies Microfinance Bank'
    },
    accountName: {
        type: String,
        default: 'Afeez Salaudeen'
    },
    accountNumber: {
        type: String,
        default: '8025329616'
    },
    telegramLink: {
        type: String,
        default: 'https://t.me/boostnaija1'
    }
}, {
    timestamps: true
});

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
