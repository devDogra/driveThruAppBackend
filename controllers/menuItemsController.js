const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose'); 


const getMenuItemById = async (req, res) => {
        const id = req.params.id; 
        const isValidId = mongoose.Types.ObjectId.isValid(id); 

        if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId"})

        try {
            const menuItem = await MenuItem.findById(id);
            console.log({menuItem}); 
            res.json({menuItem}); 
        } catch(err) {
            console.log(err.message); 
            return res.json({error: err.message}); 
        }
}

const getAllMenuItems = async (req, res) => {
    try {
        const allMenuItems = await MenuItem.find({});
        return res.json({allMenuItems});
    } catch(err) {
        return res.json({error: err.message}); 
    }
}


module.exports = {
    getAllMenuItems,
    getMenuItemById,
}