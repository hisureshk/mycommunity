const Order = require('../models/Order');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const { log } = require('console');

// Generate a 6-digit numeric OTP
const otp = otpGenerator.generate(6, { 
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
});

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
        const savedOrder = await order.save();
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('buyer', '-password')
            .populate('items.item');
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
        const { status } = req.body;
        console.log("orderId", orderId, "itemId", itemId, "status", status);
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
            .populate('items.item');
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
            .populate('items.item');
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