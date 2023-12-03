const mongoose = require('mongoose'); 
const Order = mongoose.model("Order"); 
const MenuItem = mongoose.model("MenuItem"); 
const User = mongoose.model("User");

async function populateOrders() {
        const menuItemIds = (await MenuItem.where()).map(mi => mi._id);
        const customer = await User.findOne({ role: "Customer" });

        const order = new Order({
            items: [
                {
                    menuItemId: menuItemIds[0],
                    quantity: 3,
                },
                {
                    menuItemId: menuItemIds[1],
                    quantity: 1,
                },
                {
                    menuItemId: menuItemIds[2],
                    quantity: 6,
                }
            ],
            customerId: customer._id, 
        })

        const order2 = new Order({
            items: [
                {
                    menuItemId: menuItemIds[0],
                    quantity: 8,
                },
              
            ],
            customerId: customer._id, 
        })

        await order.save()
        await order2.save()
}

module.exports = populateOrders; 