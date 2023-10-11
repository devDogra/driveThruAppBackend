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

const updateUserById = async (req, res) => {
    const id = req.params.id; 
    const updatedData = req.body; 
    
    const isValidId = mongoose.Types.ObjectId.isValid(id); 
    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" });

    let updateResult = null;
    try {
        const user = await User.findById(id); 
        if (!user) return res.status(404).json({ error: "User not found" })
        const updatedUser = Object.assign(user, updatedData); 
        updateResult =  await updatedUser.save();
    } catch(err) {
        return res.status(400).json({ error: err.message, message: "Could not update user" });
    }

    return res.status(200).json({ success: "User updated succesfully ", updatedUser: updateResult});
}

module.exports = {
    getUserById,
    getAllUsers,
    deleteUserById,
    updateUserById,
}