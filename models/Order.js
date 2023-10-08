const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const ObjectId = Schema.Types.ObjectId;

const MenuItem = require("./MenuItem");

const OrderItemSchema = new Schema({ _id : false });
OrderItemSchema
    .add({
        quantity: { 
            type: Number, 
            required: true,
        }
    })
    .add({
        menuItemId: {
            type: ObjectId,
            required: true,
            ref: "MenuItem",
        }
    })

const OrderSchema = new Schema({
    items: { 
        type: [ OrderItemSchema ],
        required: true,
        default: [],
        validate: {
            validator: (items) => items.length > 0,
            message: props => `Order must have atleast 1 item`
        },
    },
    customerId: {
        type: ObjectId,
        required: true,
        ref: "User",
    },
    state: {
        type: String,
        enum: [ "Pending", "Prepared", "Delivered"]
    }
}, { timestamps: true} )

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order; 