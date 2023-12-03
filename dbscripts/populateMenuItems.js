const addImagesToMenuItemsInDB = require('./addImagesToMenuItemsInDB');
const mongoose = require('mongoose'); 
const MenuItem = mongoose.model("MenuItem"); 
// Create menu items
async function populateMenuItems() {

    const burger = new MenuItem({
        name: "Burger",
        price: 120,
        description: "A very juicy burger",
        itemNumber: 1,
    })
    const pepsi = new MenuItem({
        name: "Pepsi",
        description: "Extra fizzy",
        price: 50,
        itemNumber: 2,
    })
    const fries = new MenuItem({
        name: "Fries",
        description: "Crisp and golden",
        price: 50,
        itemNumber: 3,
    })

    await burger.save();
    await pepsi.save();
    await fries.save();

    await addImagesToMenuItemsInDB();
}

module.exports = populateMenuItems; 