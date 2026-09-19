const Chat = require('../models/Chat');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get or create conversation for user
// @route   GET /api/chats/me
// @access  Private
const getMyChat = async (req, res) => {
    let chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
        chat = await Chat.create({
            user: req.user._id,
            messages: [{
                sender: 'bot',
                message: "Hello! Welcome to LOGS=SALES support. Please select how we can help you today:\n1️⃣ Buy account\n2️⃣ Deposit issue\n3️⃣ Product complaint\n4️⃣ Talk to admin"
            }]
        });
    }

    res.json(chat);
};

// @desc    Add message to conversation
// @route   POST /api/chats/message
// @access  Private
const sendMessage = async (req, res) => {
    const { message, image, senderType } = req.body;
    const userId = req.user.isAdmin && req.body.userId ? req.body.userId : req.user._id;
    
    const chat = await Chat.findOne({ user: userId });

    if (!chat) return res.status(404).json({ message: 'Conversation not found' });

    const newMessage = {
        sender: senderType || (req.user.isAdmin ? 'admin' : 'user'),
        message,
        image,
        status: 'sent',
        createdAt: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    
    if (req.user.isAdmin) {
        chat.unreadCountUser += 1;
    } else {
        chat.unreadCountAdmin += 1;
    }

    await chat.save();
    res.status(201).json(newMessage);
};

// @desc    Get all conversations for admin
// @route   GET /api/chats
// @access  Private/Admin
const getAllChats = async (req, res) => {
    const chats = await Chat.find({})
        .populate('user', 'name email balance')
        .sort({ lastMessage: -1 });
    res.json(chats);
};

// @desc    Update conversation status
// @route   PUT /api/chats/:id/status
// @access  Private/Admin
const updateChatStatus = async (req, res) => {
    const { status } = req.body;
    const chat = await Chat.findById(req.params.id);

    if (chat) {
        chat.status = status;
        await chat.save();
        res.json(chat);
    } else {
        res.status(404).json({ message: 'Chat not found' });
    }
};

// @desc    Mark messages as seen
// @route   PUT /api/chats/seen
// @access  Private
const markAsSeen = async (req, res) => {
    const userId = req.user.isAdmin && req.body.userId ? req.body.userId : req.user._id;
    const chat = await Chat.findOne({ user: userId });

    if (chat) {
        chat.messages.forEach(msg => {
            if (req.user.isAdmin) {
                if (msg.sender === 'user') msg.status = 'seen';
            } else {
                if (msg.sender === 'admin' || msg.sender === 'bot') msg.status = 'seen';
            }
        });

        if (req.user.isAdmin) {
            chat.unreadCountAdmin = 0;
        } else {
            chat.unreadCountUser = 0;
        }

        await chat.save();
        res.json({ message: 'Marked as seen' });
    } else {
        res.status(404).json({ message: 'Chat not found' });
    }
};

// @desc    Approve deposit from chat
// @route   POST /api/chats/deposit/approve
// @access  Private/Admin
const approveChatDeposit = async (req, res) => {
    const { userId, amount, imageUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create a transaction record
    const transaction = await Transaction.create({
        user: userId,
        amount: Number(amount),
        type: 'deposit',
        status: 'approved',
        paymentProof: imageUrl,
        description: `Deposit approved via chat support`
    });

    user.balance += Number(amount);
    await user.save();

    // Add a confirmation message to chat
    const chat = await Chat.findOne({ user: userId });
    if (chat) {
        chat.messages.push({
            sender: 'admin',
            message: `✅ Your deposit of ₦${amount} has been approved and credited to your wallet.`,
            createdAt: new Date()
        });
        await chat.save();
    }

    res.json({ message: 'Deposit approved', balance: user.balance });
};

module.exports = {
    getMyChat,
    sendMessage,
    getAllChats,
    updateChatStatus,
    markAsSeen,
    approveChatDeposit
};
