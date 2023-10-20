const express = require('express');
const router = express.Router(); 
const usersController = require('../../controllers/usersController');
const allowRoles = require('../../middleware/allowRoles');
const ROLES = require('../../config/roles')


const allowedRoles = {
    GET: allowRoles(ROLES.Admin),
    GET_id: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin),
    DELETE_id: (req, res, next) => { next() },
    PUT_id: (req, res, next) => { next() },
}

router.route('/:id')
    .get(allowedRoles.GET_id, usersController.getUserById)
    .delete(usersController.deleteUserById)
    .put(usersController.updateUserById)

router.route('/')
    .get(allowedRoles.GET, usersController.getAllUsers);

module.exports = router; 