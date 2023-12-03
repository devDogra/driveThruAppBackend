const { saltRounds } = require('../config/bcryptConfig.json');
const mongoose = require('mongoose'); 
const User = mongoose.model("User"); 
const ROLES = require("../config/roles.json");
const bcrypt = require('bcrypt'); 

module.exports = async function populateAccounts() {
    const user1 = {
        firstName: "Dev",
        phone: 9811061693,
        password: "devdevdev",
        role: ROLES.Admin,
    }
    const user2 = {
        firstName: "testMgr",
        lastName: "testMgr",
        phone: 9811061692,
        password: "mgrmgrmgr",
        role: ROLES.Manager,
    }
    const user3 = {
        firstName: "testEmp",
        lastName: "testEmp",
        phone: 9811061691,
        password: "empempemp",
        role: ROLES.Employee,
    };
    const user4 = {
        firstName: "testCust",
        lastName: "testCust",
        password: "cuscuscus",
        phone: 9811061690,
        role: ROLES.Customer,
    };

    const hashedPassword1 = await bcrypt.hash(user1.password, saltRounds)
    const hashedPassword2 = await bcrypt.hash(user2.password, saltRounds)
    const hashedPassword3 = await bcrypt.hash(user3.password, saltRounds)
    const hashedPassword4 = await bcrypt.hash(user4.password, saltRounds)

    user1.password = hashedPassword1;
    user2.password = hashedPassword2;
    user3.password = hashedPassword3;
    user4.password = hashedPassword4;

    let user11 = new User(user1);
    let user22 = new User(user2);
    let user33 = new User(user3);
    let user44 = new User(user4);
    
    await user11.save();
    // await user22.save();
    await user33.save();
    await user44.save();
}