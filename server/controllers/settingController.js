const Setting = require('../models/Setting');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({});
        }
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
    try {
        let settings = await Setting.findOne();
        
        if (!settings) {
            settings = new Setting();
        }

        settings.bankName = req.body.bankName || settings.bankName;
        settings.accountName = req.body.accountName || settings.accountName;
        settings.accountNumber = req.body.accountNumber || settings.accountNumber;
        settings.telegramLink = req.body.telegramLink || settings.telegramLink;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSettings,
    updateSettings
};
