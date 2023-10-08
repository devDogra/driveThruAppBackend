const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const ObjectId = Schema.Types.ObjectId;

const ROLES = require("../config/roles.json");
const isValidPhoneNumber = require("../utils/isValidPhoneNumber");

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String },

    phone: { type: Number, required: true, 
        validate: {
            validator: isValidPhoneNumber,
            message: props => `${props.value} is not a valid phone number`
        },
    },

    role: { 
        type: String, 
        enum: [ ROLES.Customer, ROLES.Employee, ROLES.Admin ], 
        required: true, 
        default: ROLES.Customer,
    },
})

const User = mongoose.model("User", UserSchema);
module.exports = User; 