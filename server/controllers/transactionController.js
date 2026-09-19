const Transaction = require('../models/Transaction');
const User = require('../models/User');
const sendAdminNotification = require('../utils/sendEmail');

// @desc    Create a deposit request
// @route   POST /api/transactions/deposit
// @access  Private
const createDeposit = async (req, res) => {
    const { amount, paymentProof } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Valid amount is required' });
    }

    const transaction = new Transaction({
        user: req.user._id,
        amount,
        type: 'deposit',
        paymentProof,
        description: `Deposit request of ₦${amount}`
    });

    const createdTransaction = await transaction.save();

    // Fetch user to get name/email
    const user = await User.findById(req.user._id);
    
    // Notify Admin asynchronously
    sendAdminNotification(
        'New Deposit Request: ₦' + amount,
        `Hello Admin,\n\nA new wallet funding/deposit request has been submitted.\n\nUser: ${user.name} (${user.email})\nAmount: ₦${amount}\n\nPlease check the admin panel to view the proof of payment and approve or reject it.`
    );

    res.status(201).json(createdTransaction);
};

// @desc    Get current user's transactions
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
};

// --- ADMIN ONLY ---

// @desc    Get all transactions (deposits)
// @route   GET /api/transactions
// @access  Private/Admin
const getAllTransactions = async (req, res) => {
    const transactions = await Transaction.find({ type: 'deposit' }).populate('user', 'name email balance').sort({ createdAt: -1 });
    res.json(transactions);
};

// @desc    Update deposit status (Approve/Reject)
// @route   PUT /api/transactions/:id/status
// @access  Private/Admin
const updateDepositStatus = async (req, res) => {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id).populate('user');

    if (transaction) {
        if (transaction.status !== 'pending') {
            return res.status(400).json({ message: 'Transaction already processed' });
        }

        transaction.status = status;

        if (status === 'approved') {
            const userToUpdate = await User.findById(transaction.user._id);
            if (userToUpdate) {
                userToUpdate.balance += transaction.amount;
                await userToUpdate.save();
            }
        }

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
};

module.exports = { createDeposit, getMyTransactions, getAllTransactions, updateDepositStatus };
