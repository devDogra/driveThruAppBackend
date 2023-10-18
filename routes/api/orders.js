const express = require('express'); 
const router = express.Router(); 
const ordersController = require('../../controllers/ordersController');
const allowRoles = require('../../middleware/allowRoles');
const ROLES = require('../../config/roles')




const allowedRoles = {
    GET: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin),
    POST: allowRoles(ROLES.Customer, ROLES.Manager, ROLES.Admin),
    GET_id: null, 
    DELETE_id: null,
    PUT_id: null,
}
router.route('/')
    .get(allowedRoles.GET, ordersController.getAllOrdersByUserId) // If no ID is supplied, just GETs all orders
    .post(allowedRoles.POST, ordersController.createOrder)

router.route('/:id')
    .get(ordersController.getOrderById)
    .delete(ordersController.deleteOrderById)
    .put(ordersController.updateOrderById)


module.exports = router;

