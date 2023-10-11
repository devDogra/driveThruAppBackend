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
const deleteOrderById = async (req, res) => {res.send("DEL /id")}
const getOrderById = async (req, res) => {res.send("GET /id")}
const getAllOrdersByUserId = async (req, res) => {res.send("GET /")}


module.exports = {
    createOrder,
    updateOrderById, 
    deleteOrderById,
    getOrderById,
    getAllOrdersByUserId
}