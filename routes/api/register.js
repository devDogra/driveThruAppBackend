const express = require('express'); 
const ROLES = require("../../config/roles.json");
const User = require("../../models/User")

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
    .post(async (req, res) => {
        console.log("Registering..."); 
        let userData = req.body;
        if (userData.role && userData.role != ROLES.Customer) {
            return res.status(401).json({message: "New accounts can only have the 'Customer' role"})
        }

        const user = new User(userData);
        try {
            await user.save();
            return res.status(201).json({success: "Account created succesfully"}); 
        } catch(err) {
            console.log({...err}); 
            let errorMsg = err.message; 
            // If there is a duplicate error, find what fields it exists on and set the appropriate errorMsg
            if (err.code === 11000) {
                Object.keys(user._doc).forEach(key => {
                    console.log({key}); 
                    if (err.keyValue[key]) {
                        errorMsg = `An account with the provided ${key} already exists`
                    }
                })
            }

            return res.status(400).json({error: errorMsg})
        }

    })

module.exports = router; 