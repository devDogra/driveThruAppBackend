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

function isValidOrderStateUpdate(updatedState, user, order) {
    const role = user.role; 

    if (order.state == "Cancelled" || order.state == "Delivered") return [false, "Cannot update cancelled or delivered orders"];

    if (!updatedState) return [true, null];

    // Any role can cancel the order
    if (updatedState == "Cancelled") {
        if (role == ROLES.Customer) {
            const now = new Date(); 
            if (now > order.cancellationDeadlineDate) {
                return [false, "Cancellation time expired"]
            }
        } 
        
        // because non Customers can cancel orders without any deadline
        return [true, null]; 
    }
    // But only employees+ can make the order pending->delivered
    return (role != "Customer") ? [true, null] : [false, "Customers cannot set orders to delivered"]; 
}

const updateOrderById = async (req, res) => {
    const id = req.params.id; 

    const isValidId = mongoose.Types.ObjectId.isValid(id); 
    if (!isValidId) return res.status(400).json({ error: "The given ID is an invalid ObjectId" });

    let updatedData = req.body;
    let updateResult = null;
    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        const [validity, invalidReason] = isValidOrderStateUpdate(updatedData.state, req.user, order)
        if (!validity) {
            return res.status(401).json({ error: "Insufficient priviliges to update order state", message: invalidReason });
        }
    
        // If here, then state update is allowed, so
        if (["Cancelled", "Delivered"].includes(updatedData.state)) {
            // If trying to cancel or deliver an order, 
            // dont allow any updates to its items
            // or other stuff. Only cancel or deliver it. 
            updatedData = { state: updatedData.state };
        }


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
    const id = req.params.id; // orderId


    const isValidId = mongoose.Types.ObjectId.isValid(id); 
    if (!isValidId) return res.status(400).json({ error: "The given id is not a valid ObjectId" }); 

    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        
        const customerGettingOwnOrder = (
            (req.user.role == ROLES.Customer) && 
            (order.customerId.toString() === req.user._id.toString())
        ); 

        if (!customerGettingOwnOrder) {
            return res.status(403).json({ error: "Customers can only get their own order by ID" });
        }
        
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