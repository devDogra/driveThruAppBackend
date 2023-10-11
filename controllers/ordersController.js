const mongoose = require('mongoose'); 

const createOrder = async (req, res) => {
    res.send("POST /");
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