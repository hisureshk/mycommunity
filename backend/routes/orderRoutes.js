const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const auth = require('../middleware/auth');


// All routes are protected
router.use(auth);

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/user/:userId', orderController.getOrdersByUser);
router.get('/seller/:userId', orderController.getOrdersBySeller);
router.patch('/:orderId/items/:itemId', orderController.updateOrderItemStatus);

module.exports = router;