const express = require('express'); 
const registerController = require("../../controllers/registerController"); 
const router = express.Router(); 

// DONE: Dont allow registration of accounts with role other than "Customer"
// All other accs will be made by the admin

// DONE: Dont allow registration if the phone number already exists
/*
USER:
firstName STRING REQD
lastName STRING
email STRING
phone NUMBER 10DIGITS REQD
role STRING - Customer | Admin | Employee
*/
router.route('/')
    .post(registerController.handleRegister)

module.exports = router; 