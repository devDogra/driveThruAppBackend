const mongoose = require('mongoose'); 
const Order = require('../models/Order');
const ROLES = require('../config/roles.json')

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

    const order = new Order({
        ...orderData,
        customerId: req.user._id,
    });

    try {
        await order.save();
        return res.status(201).json({ success: "Order created", order });
    } catch(err) {
        console.log(err.message); 
        return res.status(400).json({ error: err.message, message: "Could not create order" });
    }

}

function canUpdateOrderState(user) {
    // user.role will ALWAYS be a valid role if the request has got to this middleware
    if (user.role == ROLES.Customer) return false; 
    else return true; 
}

const updateOrderById = async (req, res) => {
    const id = req.params.id; 

    const isValidId = mongoose.Types.ObjectId.isValid(id); 
    if (!isValidId) return res.status(400).json({ error: "The given ID is an invalid ObjectId" });

    let updatedData = req.body;
    
    // If trying to update the order state
    if (updatedData.state) {
        if (!canUpdateOrderState(req.user)) {
            return res.status(401).json({ error: "Insufficient priviliges to update order state" });
        }
    }

    // Only allow employees to update the order state
    if (req.user.role == ROLES.Employee) {
        updatedData = { state: updatedData.state }
    }

    let updateResult = null;
    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        const updatedOrder = Object.assign(order, updatedData);
        updateResult = await updatedOrder.save();
    } catch(err) {
        console.log(err.message); 
        return res.status(400).json({ error: err.message, message: "Could not update order by ID" });
    }

    return res.status(200).json({ success: "Order updated succesfully", updatedOrder: updateResult }); 

}

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

const getAllOrdersByUserId = async (req, res) => {
    const userId = req.query.userId;

    // If a customer is trying to get the orders for an account other than his
    if (
        req.user.role == ROLES.Customer && 
        req.user._id != userId
    ) {
        return res.status(403).json({ error: "Users with role 'Customer' can only GET their own orders" });
    }
    
    const isValidCustomerId = mongoose.Types.ObjectId.isValid(userId); 
    if (userId && !isValidCustomerId) return res.status(400).json({ error: "Cannot fetch orders for an invalid customer ID" });

    const queryFilter = userId ? { customerId: userId } : {} ;

    try {
        const orders = await Order.find(queryFilter);
        let successMsg = "Orders found succesfully";
        successMsg += userId ? " by user ID" : "";
        return res.status(200).json({ success: successMsg, orders })
    } catch(err) {
        console.log(err.message); 
        res.status(400).json({ error: err.message, message: "Could not get all orders by user ID" });
    }
}


module.exports = {
    createOrder,
    updateOrderById, 
    deleteOrderById,
    getOrderById,
    getAllOrdersByUserId
}