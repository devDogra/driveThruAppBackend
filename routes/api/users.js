const express = require('express');
const router = express.Router(); 
const usersController = require('../../controllers/usersController');

router.route('/:id')
    .get(usersController.getUserById)
    .delete(usersController.deleteUserById)

router.route('/')
    .get(usersController.getAllUsers);

module.exports = router; 