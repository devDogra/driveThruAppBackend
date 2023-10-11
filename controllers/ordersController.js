const mongoose = require('mongoose'); 
const Order = require('../models/Order');

const sampleOrder = 
{
    "items": [
        { "quantity": 2, "menuItemId": "6522f71241594b1c9afd126d" },
        { "quantity": 1, "menuItemId": "6522f71241594b1c9afd126e" },
        { "quantity": 1, "menuItemId": "6523c3162962d2251ffadb70" }
    ],
    "customerId": "6522f77696b9c8598af80f49",
    "state": "Pending"
}

const createOrder = async (req, res) => {
    const orderData = req.body; 
    const order = new Order(orderData);

    try {
        await order.save();
        return res.status(201).json({ success: "Order created", order });
    } catch(err) {
        console.log(err.message); 
        return res.status(400).json({ error: err.message, message: "Could not create order" });
    }

}
const updateOrderById = async (req, res) => {res.send("PUT /id")}
const deleteOrderById = async (req, res) => {
    const id = req.params.id; 
    
    const isValidId = mongoose.Types.ObjectId.isValid(id); 
    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" }); 

    try {
        await Order.findByIdAndDelete(id);
        return res.status(200).json({ success: "Order deleted succesfully" });
    } catch(err) {
        console.log(err.message); 
        return res.status(400).json({ error: err.message, message: "Could not delete order" });
    }

}
const getOrderById = async (req, res) => {
    const id = req.params.id; 
    
    const isValidId = mongoose.Types.ObjectId.isValid(id); 
    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" }); 

    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        return res.status(200).json({ success: "Order found succesfully", order });
    } catch(err) {
        console.log(err.message); 
        res.status(400).json({ error: err.message, message: "Could not get order by ID" });
    }

}
const getAllOrdersByUserId = async (req, res) => {res.send("GET /")}


module.exports = {
    createOrder,
    updateOrderById, 
    deleteOrderById,
    getOrderById,
    getAllOrdersByUserId
}