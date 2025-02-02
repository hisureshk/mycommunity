const Order = require('../models/Order');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const { log } = require('console');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', '-password')
            .populate('items.item');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyer', '-password')
            .populate('items.item');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        const newOtp = order.otp
        order.otp = crypto.createHash('sha256').update(newOtp).digest('hex');
        const savedOrder = await order.save();
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('buyer', '-password')
            .populate('items.item');
        populatedOrder.otp = newOtp;
        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        )
        .populate('buyer', '-password')
        .populate('items.item');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateOrderItemStatus = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const { otp, status } = req.body;
        const order = await Order.findById(orderId);
        const hashOtp = crypto.createHash('sha256').update(otp).digest('hex');
        if( order.otp !== hashOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        const updatedOrder = await Order.findOneAndUpdate(
            { 
                _id: orderId,
                "items._id": itemId 
            },
            {
                $set: {
                    "items.$.status": status,
                    "items.$.updatedAt": new Date()
                }
            },
            { 
                new: true,
                runValidators: true 
            }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.params.userId })
            .populate('buyer', '-password')
            .populate('items.item.seller')
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOrdersBySeller = async (req, res) => {
    try {
        const orders = await Order.find({ "items": { 
            $elemMatch: {
                seller: req.params.userId
            }}
            })
            .populate('buyer', '-password')
            .populate('items.item')
            .populate('items.item.seller');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'ORder not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};