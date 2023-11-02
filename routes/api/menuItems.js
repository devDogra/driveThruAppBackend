const express = require('express'); 
const router = express.Router(); 
const menuItemsController = require('../../controllers/menuItemsController'); 
const ROLES = require('../../config/roles.json');
const allowRoles = require('../../middleware/allowRoles')
const verifyJWT = require("../../middleware/verifyJWT");

// const allowAllRoles = allowRoles(...Object.keys(ROLES));

// Anyone can GET and GET /id menuItems, even if they're not logged in 
const allowedRoles = {
    POST: allowRoles(ROLES.Manager, ROLES.Admin),
    PUT_id: allowRoles(ROLES.Manager, ROLES.Admin),
    DELETE_id: allowRoles(ROLES.Manager, ROLES.Admin),
}

// Anyone (even non-authenticated) can GET and GET /id
router.get('/', menuItemsController.getAllMenuItems);
router.get('/:id', menuItemsController.getMenuItemById);

// But POST DELETE PUT to menuItems requires the proper role
router.use(verifyJWT);

router.route('/:id')
    .delete(allowedRoles.DELETE_id, menuItemsController.deleteMenuItemById)
    .put(allowedRoles.PUT_id, menuItemsController.updateMenuItemById)


router.route('/')
    .post(allowedRoles.POST, menuItemsController.createMenuItem)


module.exports = router; 