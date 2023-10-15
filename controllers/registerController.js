const ROLES = require("../config/roles.json");
const User = require("../models/User")
const bcrypt = require('bcrypt'); 
const { saltRounds } = require('../config/bcryptConfig.json');
const isStrongPassword = require('../utils/isStrongPassword');

const handleRegister = async (req, res) => {
    console.log("Registering..."); 
    let userData = req.body;
    if (userData.role && userData.role != ROLES.Customer) {
        return res.status(401).json({error: "New accounts can only have the 'Customer' role"})
    }

    const password = userData.password; 
    const { strong, error } = isStrongPassword(password)
    if (error) return res.status(403).json({ error });
    
    
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        userData.password = hashedPassword; 
    } catch(err) {
        console.log(err.message); 
        return res.status(500).json({error: err.message, message: "Could not hash password" });
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

}

module.exports = {
    handleRegister,
}