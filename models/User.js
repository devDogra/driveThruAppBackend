const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const ObjectId = Schema.Types.ObjectId;

const ROLES = require("../config/roles.json");
const isValidPhoneNumber = require("../utils/isValidPhoneNumber");

/*
USER:
firstName STRING REQD
lastName STRING
email STRING
phone NUMBER 10DIGITS
role STRING - Customer | Admin | Employee
*/
const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String },

    phone: { 
        type: Number, 
        required: true,
        unique: true,  
        validate: {
            validator: isValidPhoneNumber,
            message: props => `${props.value} is not a valid phone number`
        },
    },

    password: {
        type: String, 
        required: true,
    },

    role: { 
        type: String, 
        enum: [ ROLES.Customer, ROLES.Employee, ROLES.Admin ], 
        default: ROLES.Customer,
    },
})

UserSchema.statics.findByPhoneNumber = function(phone) {
    const model = this;
    return model.findOne({ phone: phone })
}

const User = mongoose.model("User", UserSchema);
module.exports = User; 

