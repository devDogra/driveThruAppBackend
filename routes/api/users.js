const express = require('express');
const router = express.Router(); 
const usersController = require('../../controllers/usersController');
const allowRoles = require('../../middleware/allowRoles');
const ROLES = require('../../config/roles')


const allowedRoles = {
    GET_id: allowRoles(ROLES.Customer, ROLES.Employee, ROLES.Manager, ROLES.Admin),
    DELETE_id: (req, res, next) => { next() },
    PUT_id: (req, res, next) => { next() },
    GET: (req, res, next) => { next() },
}

router.route('/:id')
    .get(usersController.getUserById)
    .delete(usersController.deleteUserById)
    .put(usersController.updateUserById)

router.route('/')
    .get(usersController.getAllUsers);

module.exports = router; 