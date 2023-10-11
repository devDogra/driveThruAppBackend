const express = require('express'); 
const router = express.Router(); 
const ordersController = require('../../controllers/ordersController');

router.route('/')
    .get(ordersController.getAllOrdersByUserId)
    .post(ordersController.createOrder)

router.route('/:id')
    .get(ordersController.getOrderById)
    .delete(ordersController.deleteOrderById)
    .put(ordersController.updateOrderById)


module.exports = router;