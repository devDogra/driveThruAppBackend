const express = require('express'); 
const router = express.Router(); 
const menuItemsController = require('../../controllers/menuItemsController'); 

router.route('/:id')
    .get(menuItemsController.getMenuItemById)

router.route('/')
    .get(menuItemsController.getAllMenuItems)
    .post(menuItemsController.createMenuItem)


module.exports = router; 