const User = require("../models/User");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

const PORT = process.env.PORT || 3500; 

async function addImagesToMenuItemsInDB() {
    const items = await MenuItem.find();

    for (let item of items) {
        const name = item.name; 

        let [firstChar, ...rest] = name; 
        firstChar = firstChar.toLowerCase();
        let imgfilename = [firstChar, ...rest].join('') + '.webp';

        const imgfilepath = `/static/menuItems/${imgfilename}`;
        const fullpath = `http://localhost:${PORT}${imgfilepath}`
        
        console.log(fullpath); 

        item.img = fullpath;
        const newitem = await item.save();
        console.log({newitem});
    }

    const items2 = await MenuItem.find();
    console.log(items2); 
}

module.exports = addImagesToMenuItemsInDB;