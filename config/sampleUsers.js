const ROLES = require('./roles.json');


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

module.exports = {
    user1, 
    user2, 
    user3, 
    user4,
}