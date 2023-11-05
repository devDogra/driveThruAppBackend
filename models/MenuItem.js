const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const ObjectId = Schema.Types.ObjectId;


const MenuItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    // The number that will appear on the UI 
    // EG: "I want a #7"
    itemNumber: {
        type: Number,
        required: true,  
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    }, 
    img: {
        type: String,
        default: "/path/to/no/img/img"
    }
})

const MenuItem = mongoose.model("MenuItem", MenuItemSchema);

module.exports = MenuItem;