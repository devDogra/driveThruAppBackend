const { saltRounds } = require('../config/bcryptConfig.json');
const mongoose = require('mongoose'); 
const User = mongoose.model("User"); 
const ROLES = require("../config/roles.json");
const sampleUsers = require('../config/sampleUsers');
const bcrypt = require('bcrypt'); 

module.exports = async function populateAccounts() {
    const {user1, user2, user3, user4 } = sampleUsers;

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