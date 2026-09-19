const express = require('express');
const router = express.Router();
const {
    createDeposit,
    getMyTransactions,
    getAllTransactions,
    updateDepositStatus,
} = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/deposit', protect, createDeposit);
router.get('/my', protect, getMyTransactions);
router.get('/', protect, admin, getAllTransactions);
router.put('/:id/status', protect, admin, updateDepositStatus);

module.exports = router;
