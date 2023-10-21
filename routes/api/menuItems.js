const express = require('express'); 
const router = express.Router(); 
const menuItemsController = require('../../controllers/menuItemsController'); 
const ROLES = require('../../config/roles.json');
const allowRoles = require('../../middleware/allowRoles')

const allowAllRoles = allowRoles(...Object.keys(ROLES));

const allowedRoles = {
    GET: allowAllRoles,
    GET_id: allowAllRoles,
    POST: allowRoles(ROLES.Manager, ROLES.Admin),
    PUT_id: allowRoles(ROLES.Manager, ROLES.Admin),
    DELETE_id: allowRoles(ROLES.Manager, ROLES.Admin),
}


router.route('/:id')
    .get(allowedRoles.GET_id, menuItemsController.getMenuItemById)
    .delete(allowedRoles.DELETE_id, menuItemsController.deleteMenuItemById)
    .put(allowedRoles.PUT_id, menuItemsController.updateMenuItemById)


router.route('/')
    .get(allowedRoles.GET, menuItemsController.getAllMenuItems)
    .post(allowedRoles.POST, menuItemsController.createMenuItem)


module.exports = router; 