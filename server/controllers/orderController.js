const Order = require('../models/Order');
const Account = require('../models/Account');
const sendAdminNotification = require('../utils/sendEmail');

const addOrderItems = async (req, res) => {
    const { accountId } = req.body;
    const User = require('../models/User'); // Include User model
    const Transaction = require('../models/Transaction');

    const account = await Account.findById(accountId);
    if (!account || account.stock <= 0) {
        return res.status(400).json({ message: 'Account out of stock or not found' });
    }

    const user = await User.findById(req.user._id);

    // Check balance
    if (user.balance < account.price) {
        return res.status(400).json({ message: 'Insufficient balance to purchase this listing. Please fund your wallet.' });
    }

    // Deduct Balance
    user.balance -= account.price;
    await user.save();

    // Deduct Stock
    account.stock -= 1;
    await account.save();

    // Create Order
    const order = new Order({
        user: req.user._id,
        account: accountId,
        orderId: 'LOG-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        paymentMethod: 'wallet',
        status: 'completed',
        deliveredAt: Date.now()
    });
    const createdOrder = await order.save();

    // Create Purchase Transaction
    await Transaction.create({
        user: req.user._id,
        amount: account.price,
        type: 'purchase',
        status: 'completed',
        description: `Purchased ${account.title}`
    });

    // Notify Admin asynchronously
    sendAdminNotification(
        'New Order Placed: ' + account.title,
        `Hello Admin,\n\nA new order has just been placed!\n\nUser: ${user.name} (${user.email})\nItem: ${account.title}\nPrice: ₦${account.price}\nOrder ID: ${createdOrder.orderId}\nLog in to the admin panel for details.`
    );

    res.status(201).json(createdOrder);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('account');

    if (order) {
        // Only allow owner or admin to see
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('account');
    res.json(orders);
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name').populate('account');
    res.json(orders);
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        if (order.status === 'completed') {
            order.deliveredAt = Date.now();
            // Deduct stock if finished
            const account = await Account.findById(order.account);
            if (account) {
                account.stock = Math.max(0, account.stock - 1);
                await account.save();
            }
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus };
