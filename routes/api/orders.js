const express = require('express'); 
const router = express.Router(); 
const ordersController = require('../../controllers/ordersController');
const allowRoles = require('../../middleware/allowRoles');
const ROLES = require('../../config/roles')

router.route('/')
    .get(ordersController.getAllOrdersByUserId) // If no ID is supplied, just GETs all orders
    .post(allowRoles(ROLES.Customer, ROLES.Manager, ROLES.Admin), ordersController.createOrder)

router.route('/:id')
    .get(ordersController.getOrderById)
    .delete(ordersController.deleteOrderById)
    .put(ordersController.updateOrderById)


module.exports = router;

