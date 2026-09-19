const Account = require('../models/Account');

// @desc    Fetch all accounts with filtering
// @route   GET /api/accounts
const getAccounts = async (req, res) => {
    const { platform, type, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (platform && platform !== 'all') query.platform = platform;
    if (type && type !== 'all') query.type = type;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const accounts = await Account.find(query).sort({ createdAt: -1 });
    res.json(accounts);
};

// @desc    Fetch single account
// @route   GET /api/accounts/:id
const getAccountById = async (req, res) => {
    const account = await Account.findById(req.params.id);
    if (account) {
        res.json(account);
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
};

// @desc    Create an account listing (Admin)
// @route   POST /api/accounts
const createAccount = async (req, res) => {
    const { platform, type, title, description, price, stock, image, media, credentials, badges } = req.body;
    
    // Set image to the first media URL if it is not explicitly provided
    const finalImage = image || (media && media.length > 0 ? media[0] : '');
    
    const account = new Account({
        platform, type, title, description, price, stock, image: finalImage, media: media || [], credentials, badges,
    });

    const createdAccount = await account.save();
    res.status(201).json(createdAccount);
};

// @desc    Update an account (Admin)
// @route   PUT /api/accounts/:id
const updateAccount = async (req, res) => {
    const account = await Account.findById(req.params.id);

    if (account) {
        account.platform = req.body.platform || account.platform;
        account.type = req.body.type || account.type;
        account.title = req.body.title || account.title;
        account.description = req.body.description || account.description;
        account.price = req.body.price !== undefined ? req.body.price : account.price;
        account.stock = req.body.stock !== undefined ? req.body.stock : account.stock;
        account.media = req.body.media || account.media;
        account.image = req.body.image || (account.media && account.media.length > 0 ? account.media[0] : account.image);
        account.credentials = req.body.credentials || account.credentials;
        account.badges = req.body.badges || account.badges;

        const updatedAccount = await account.save();
        res.json(updatedAccount);
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
};

// @desc    Delete an account (Admin)
// @route   DELETE /api/accounts/:id
const deleteAccount = async (req, res) => {
    const account = await Account.findById(req.params.id);
    if (account) {
        await account.deleteOne();
        res.json({ message: 'Account removed' });
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
};

module.exports = { getAccounts, getAccountById, createAccount, updateAccount, deleteAccount };
