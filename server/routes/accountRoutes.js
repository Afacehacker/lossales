const express = require('express');
const router = express.Router();
const { getAccounts, getAccountById, createAccount, updateAccount, deleteAccount } = require('../controllers/accountController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAccounts);
router.get('/:id', getAccountById);
router.post('/', protect, admin, createAccount);
router.put('/:id', protect, admin, updateAccount);
router.delete('/:id', protect, admin, deleteAccount);

module.exports = router;
