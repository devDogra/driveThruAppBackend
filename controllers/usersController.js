const mongoose = require('mongoose'); 
const User = require('../models/User');


const getUserById = async (req, res) => {
    const id = req.params.id; 

    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" });

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({error: "User not found"});
        return res.status(200).json({ success: "User found", user });
    } catch(err) {
        console.log(err); 
        return res.status(400).json({ error: err.message, message: "Could not get user by id" });
    }
}

const deleteUserById = async (req, res) => {
    const id = req.params.id; 
    
    const isValidId = mongoose.Types.ObjectId.isValid(id); 
    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" }); 

    try {
        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: "User deleted succesfully" })
    } catch(err) {
        console.log(err); 
        return res.status(400).json({ error: err.message, message: "Could not delete user by ID" }); 
    }
}

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        return res.status(200).json({ success: "All users found ", allUsers });
    } catch(err) {
        console.log(err); 
        return res.status(400).json({ error: err.message, message: "Could not get all users" })
    }
}

module.exports = {
    getUserById,
    getAllUsers,
    deleteUserById,
}