require('dotenv').config(); 
const express = require('express'); 
const mongoose = require('mongoose');
const morgan = require('morgan'); 
const ROLES = require("./config/roles"); 

const PORT = process.env.PORT || 3500; 
const DB_URI = process.env.DB_URI;

const app = express();
app.use(morgan('tiny'));
app.use(express.json()); 
app.use(express.urlencoded());


const routers = {
    register: require("./routes/api/register"),
    menuItems: require("./routes/api/menuItems"),
    users: require("./routes/api/users"),
}


app.use('/register', routers.register);
app.use('/menuItems', routers.menuItems);
app.use('/users', routers.users);


main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(DB_URI); 
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log(`Listening at http://127.0.0.1:${PORT}`)
        })

        /* ----------------------------- TEST DB MODELS ----------------------------- */
        // const User = require("./models/User");
        // const MenuItem = require("./models/MenuItem");
        // const Order = require("./models/Order");

        // await User.deleteMany({});
        // await MenuItem.deleteMany({});
        // await Order.deleteMany({});


        // const user = new User({
        //     firstName: "Dev",
        //     phone: 9811061693,
        //     role: ROLES.Admin,
        // })

        // await user.save();


        // const test = new User({
        //     firstName: "testEmp",
        //     lastName: "testEmp",
        //     phone: 1234567890,
        //     role: ROLES.Employee,
        // });

        // await test.save();
        // // const invalidPhone = new User({
        // //     firstName: "testInvalidPhone",
        // //     lastName: "testInvalidPhone",
        // //     phone: 12345678,
        // //     role: ROLES.Employee,
        // // });
        
        // // await invalidPhone.save(); 

        // const burger = new MenuItem({
        //     name: "Burger",
        //     price: 120,
        //     itemNumber: 1,
        // })

        // const pepsi = new MenuItem({
        //     name: "Pepsi",
        //     price: 50,
        //     itemNumber: 2,
        // })

        // await burger.save();
        // await pepsi.save(); 


        // const menuItemIds = (await MenuItem.where()).map(mi => mi._id);
        // console.log({menuItemIds}); 

        // const [burgerId, pepsiId] = menuItemIds; 

        // const order = new Order({
        //     items: [
        //         {
        //             menuItemId: burgerId,
        //             quantity: 3,
        //         },
        //         {
        //             menuItemId: pepsiId,
        //             quantity: 1,
        //         }
        //     ],
        //     customerId: user._id, 
        // })
        // await order.save()
    
        /* -------------------------------------------------------------------------- */

    } catch(err) {
        console.log("ERROR: ");
        console.log(err.message); 
        console.log("Restart server"); 
        process.exit()
    }


}