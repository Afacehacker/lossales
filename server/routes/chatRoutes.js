const express = require('express');
const router = express.Router();
const {
    getMyChat,
    sendMessage,
    getAllChats,
    updateChatStatus,
    markAsSeen,
    approveChatDeposit
} = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyChat);
router.post('/message', protect, sendMessage);
router.put('/seen', protect, markAsSeen);

// Admin Routes
router.get('/', protect, admin, getAllChats);
router.put('/:id/status', protect, admin, updateChatStatus);
router.post('/deposit/approve', protect, admin, approveChatDeposit);

module.exports = router;
