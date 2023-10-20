const mongoose = require('mongoose'); 
const User = require('../models/User');
const ROLES = require('../config/roles');

const getUserById = async (req, res) => {
    const id = req.params.id; 
    console.log("REQUESTER ROLE => ", req.user.role); 

    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" });

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({error: "User not found"});
        
        const gettingOwnAccount = user._id.toString() === req.user._id.toString();

        // Customers and Employees can only get their own details
        if (req.user.role == ROLES.Customer || req.user.role == ROLES.Employee) {
            if (!gettingOwnAccount) {
                return res.status(403).json({ error: `${req.user.role}s can only get their own account details`});
            }
        }
        
        // Managers can get their own + employee details
        const gettingEmployeeAccount = user.role == ROLES.Employee;
        if (req.user.role == ROLES.Manager) {
            console.log("Role is manager"); 
            if (!gettingEmployeeAccount && !gettingOwnAccount) {
                return res.status(403).json({ error: `${req.user.role}s can only get their own or employee account details`});
            } 
        }

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
        // await User.findByIdAndDelete(id);
        const userToDelete = await User.findById(id);
        const deletingOwnAccount = req.user._id.toString() === id;
        const deletingEmployeeAccount = userToDelete.role === ROLES.Employee; 
        const deletingAdminAccount = userToDelete.role === ROLES.Admin;

        console.log({
            userToDelete, 
            deletingOwnAccount,
            deletingEmployeeAccount,
            deletingAdminAccount,
        })

        if (req.user.role == ROLES.Customer || req.user.role == ROLES.Employee){
            if (!deletingOwnAccount) return res.status(403).json({ error: `${req.user.role}s can only delete their own account`})
        }
        if (req.user.role == ROLES.Manager) {
            if (!deletingOwnAccount && !deletingEmployeeAccount) return res.status(403).json({ error: `${req.user.role}s can only delete their own or Employee accounts`})
        }
        if (req.user.role == ROLES.Admin) {
            if (deletingAdminAccount) {
                return res.status(403).json({ error: `${req.user.role}s cannot delete their own accounts`})
            }
        }

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