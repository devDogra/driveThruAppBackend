const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');


const getMenuItemById = async (req, res) => {
    const id = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" })

    try {
        const menuItem = await MenuItem.findById(id);
        console.log({ menuItem });
        res.json({ menuItem });
    } catch (err) {
        console.log(err.message);
        return res.json({ error: err.message, message: "Could not get menu item by ID" });
    }
}

const updateMenuItemById = async (req, res) => {
    const id = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" })

    const updatedItemData = req.body; 

    try {
        const itemToUpdate = await MenuItem.findById(id);
        if (!itemToUpdate) return res.status(404).json({ error: "Menu item not found" });
        const updatedItem = Object.assign(itemToUpdate, updatedItemData);
        await updatedItem.save();
    } catch(err) {
        console.log(err); 
        return res.status(400).json({ error: err, message: "Could not update item" });
    }

    return res.status(200).json({ success: "Menu item updated succesfully" }); 
}

const getAllMenuItems = async (req, res) => {
    try {
        const allMenuItems = await MenuItem.find({});
        return res.json({ allMenuItems });
    } catch (err) {
        return res.json({ error: err.message, message: "Could not get all menu items" });
    }
}

const createMenuItem = async (req, res) => {
    const itemData = req.body; 
    const item = new MenuItem(itemData);
    
    try {
        await item.save(); 
        return res.status(201).json({success: "Menu Item created", menuItem: item})
    } catch(err) {
        console.log({...err}); 
        return res.json({error: err.message, message: "Could not create Menu Item"});         
    }

}

const deleteMenuItemById = async (req, res) => {
    const id = req.params.id; 
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) return res.status(400).json({ error: "The given ID is not a valid ObjectId" });

    try {
        await MenuItem.deleteOne({ _id: id });
        return res.status(200).json({ success: "Item deleted succesfully" });
    } catch(err) {
        console.log(err); 
        return res.status(400).json({error: err.message, message: "Could not delete menu item by ID" });
    }
}

module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    deleteMenuItemById,
    updateMenuItemById,
}