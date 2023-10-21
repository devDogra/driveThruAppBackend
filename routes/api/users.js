const express = require('express');
const router = express.Router(); 
const usersController = require('../../controllers/usersController');
const allowRoles = require('../../middleware/allowRoles');
const ROLES = require('../../config/roles')


const allowedRoles = {
    GET: allowRoles(ROLES.Admin),
    GET_id: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin),
    // Customer, Emp => Delete own account
    // Manager => Delete own + employee account
    // Admin => Delete any account
    DELETE_id: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin),
    PUT_id: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin),
}

router.route('/:id')
    .get(allowedRoles.GET_id, usersController.getUserById)
    .delete(allowedRoles.DELETE_id, usersController.deleteUserById)
    .put(usersController.updateUserById)

router.route('/')
    .get(allowedRoles.GET, usersController.getAllUsers);

module.exports = router; 