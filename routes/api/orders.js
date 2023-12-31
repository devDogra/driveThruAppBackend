const express = require('express'); 
const router = express.Router(); 
const ordersController = require('../../controllers/ordersController');
const allowRoles = require('../../middleware/allowRoles');
const ROLES = require('../../config/roles')




const allowedRoles = {
    GET: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin),
    POST: allowRoles(ROLES.Customer, ROLES.Manager, ROLES.Admin),
    GET_id: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin), 
    DELETE_id: allowRoles(ROLES.Admin),
    // Customer: 
        // Set order state to cancelled
        // Change items/quantity
    // Emps: 
        // Set order state to delivered
    PUT_id: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin),
}
router.route('/')
    .get(allowedRoles.GET, ordersController.getAllOrdersByUserId) // If no ID is supplied, just GETs all orders
    .post(allowedRoles.POST, ordersController.createOrder)

router.route('/:id')
    .get(allowedRoles.GET_id, ordersController.getOrderById)
    .delete(allowedRoles.DELETE_id, ordersController.deleteOrderById)
    .put(allowedRoles.PUT_id, ordersController.updateOrderById)


module.exports = router;

