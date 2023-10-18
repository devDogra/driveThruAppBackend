const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const ObjectId = Schema.Types.ObjectId;

const MenuItem = require("./MenuItem");
// ORDERITEM: 
// quantity: Number
// menuItemId 

const sampleOrder = 
{
    "items": [
        { "quantity": 2, "menuItemId": "6522f71241594b1c9afd126d" },
        { "quantity": 1, "menuItemId": "6522f71241594b1c9afd126e" }
    ],
    "customerId": "652bf4aff9929160ac682eec"
}

// ORDER:
// items: [OrderItem]
// customerId: ObjectId
// state: String - Pending | Prepared | Delivered
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
        enum: [ "Pending", "Delivered"],
        default: "Pending",
    }
}, { timestamps: true} )

OrderSchema.statics.getStateList = function() {
    const model = this;
    return model.schema.path('state').enumValues; 
}

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order; 