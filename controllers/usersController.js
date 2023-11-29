const mongoose = require('mongoose'); 
const User = require('../models/User');
const ROLES = require('../config/roles');

const getUserByIdOrPhone = async (req, res) => {
    const id = req.params.id; 
    const idIsPhoneNumber = req.query.byPhone;

    console.log("REQUESTER ROLE => ", req.user.role); 

    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId && !idIsPhoneNumber) return res.status(400).json({ error: "The given id is not a valid ObjectId" });

    try {
        let user = null;
        if (idIsPhoneNumber) {
            user = await User.findByPhoneNumber(id);
        } else {
            user = await User.findById(id);
        }
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
        const userToDelete = await User.findById(id);

        if (!userToDelete) return res.status(404).json({ error: "No user with the given id exists" }); 

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
    const updatedRole = updatedData.role; 
    
    const isValidId = mongoose.Types.ObjectId.isValid(id); 
    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" });



    let updateResult = null;
    try {
        const user = await User.findById(id); 
        if (!user) return res.status(404).json({ error: "User not found" })

        const updatingOwnAccount = req.user.id == id; 
        const updatingEmployeeAccount = user.role == ROLES.Employee;
        
        /* ------ Check if req.user is actually allowed to update this account ------ */
        if (req.user.role == ROLES.Customer || req.user.role == ROLES.Employee) {
            if (!updatingOwnAccount) return res.status(403).json({ error: `${req.user.role}s are only allowed to update their own account`})
        }
        if (req.user.role == ROLES.Manager) {
            if (!updatingOwnAccount && !updatingEmployeeAccount) {
                return res.status(403).json({
                    error: `${req.user.role}s are only allowed to update their own or employee accounts`
                })
            }
        }
    
        /* ---------------------- Check if role update is valid --------------------- */
        if (updatedRole) {
            // Then the role is being updated
            if (req.user.role == ROLES.Customer || req.user.role == ROLES.Employee){
                return res.status(403).json({ error: `${req.user.role} are not allowed to update user roles` });
            }
            if (!Object.keys(ROLES).includes(updatedRole)) {
                return res.status(400).json( { error: `${updatedRole} is not a valid role`})
            }
            if (req.user.role == ROLES.Manager) {
                if (updatedRole != ROLES.Customer) {
                    return res.status(403).json({ error: `${ROLES.Manager}s are only allowed to give the ${ROLES.Customer} role to accounts`})                
                }
            }   
            
            if (req.user.role == ROLES.Admin) {
                if (updatedRole != ROLES.Admin) {
                    return res.status(403).json({ error: `${ROLES.Admin}s cannot demote themselves to a lower role`})
                }
            }
        }


        const updatedUser = Object.assign(user, updatedData); 
        updateResult =  await updatedUser.save();
    } catch(err) {
        return res.status(400).json({ error: err.message, message: "Could not update user" });
    }

    return res.status(200).json({ success: "User updated succesfully ", updatedUser: updateResult});
}

module.exports = {
    getUserByIdOrPhone,
    getAllUsers,
    deleteUserById,
    updateUserById,
}