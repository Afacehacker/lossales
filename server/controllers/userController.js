const User = require('../models/User');
const BlockedIP = require('../models/BlockedIP');
const jwt = require('jsonwebtoken');
const { getClientIp, isPrivateIp } = require('../utils/ipHelper');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        user.lastIp = getClientIp(req);
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            balance: user.balance,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({ 
        name, 
        email, 
        password,
        lastIp: getClientIp(req)
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            balance: user.balance,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            balance: user.balance,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
};

// @desc    Update user balance/info
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.balance = req.body.balance !== undefined ? req.body.balance : user.balance;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            balance: updatedUser.balance,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user and block IP
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        const { blockIp } = req.query; // If admin wants to block IP
        if (blockIp === 'true' && user.lastIp && !isPrivateIp(user.lastIp)) {
            const adminIp = getClientIp(req);
            // Prevent blocking if the user's IP is the same as the admin's IP
            if (user.lastIp !== adminIp) {
                const alreadyBlocked = await BlockedIP.findOne({ ip: user.lastIp });
                if (!alreadyBlocked) {
                    await BlockedIP.create({ ip: user.lastIp, reason: `Blocked when deleting user ${user.email}` });
                }
            } else {
                console.log(`[WARNING] Admin attempted to block their own IP (${adminIp}). Skipped IP blocking.`);
            }
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { authUser, registerUser, getUserProfile, getUsers, updateUser, deleteUser };
