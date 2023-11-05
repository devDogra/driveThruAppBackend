require('dotenv').config(); 
const fs = require('fs/promises');
const path = require('path');
const express = require('express'); 
const mongoose = require('mongoose');
const morgan = require('morgan'); 
const dateFns = require('date-fns'); 
const ROLES = require("./config/roles"); 
const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const verifyJWT = require('./middleware/verifyJWT');
const allowRoles = require('./middleware/allowRoles'); 
const addImagesToMenuItemsInDB = require('./dbscripts/addImagesToMenuItemsInDB'); 

const PORT = process.env.PORT || 3500; 
const DB_URI = process.env.DB_URI;

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next(); 
})
app.use(morgan('tiny'));
app.use(cors({
    credentials: true, 
    origin: true, // Reflect the requests's origin
}));
app.use(express.json()); 
app.use(express.urlencoded());
app.use(cookieParser());

app.use(
    '/static', 
    express.static(
        path.join(__dirname, 'static'), 
    ), 
    (req, res, next) => {
        const url = req.url;
        const pathOf404Img = path.join(__dirname, 'static', '404.webp');
        res.sendFile(pathOf404Img);
    }, 
)

const routers = {
    register: require("./routes/api/register"),
    menuItems: require("./routes/api/menuItems"),
    users: require("./routes/api/users"),
    orders: require("./routes/api/orders"),
    login: require("./routes/api/login"),
    refreshToken: require('./routes/api/refreshToken'),
    validate: require('./routes/api/validate')
}

app.use((req, res, next) => {
    console.log("COOKIES:"); 
    console.log(req.cookies)
    next();
})
app.use('/register', routers.register);
app.use('/login', routers.login);
app.use('/refreshToken', routers.refreshToken);
app.use('/unprotected', (req, res) => res.send("Unprotected OK")); 

// Requires authentication for non-GET methods
app.use('/menuItems', routers.menuItems);

app.use(verifyJWT); 

app.use('/users', routers.users);
app.use('/orders', routers.orders);
app.use('/validate', routers.validate); // Check if user is logged in 

app.use('/protected', (req, res) => {
    return res.send("I am protected and can only be accessed by users with a valid AccJWT"); 
})

app.use('/allowCustomers', 
    allowRoles('Customer', 'Employee', 'Admin'), 
    (req, res) => res.send("OK: /allowCustomers")
);

app.use('/allowEmployees', 
    allowRoles('Employee', 'Admin'),
    (req, res) => res.send("OK: /allowEmployees")
)


main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(DB_URI); 
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log(`Listening at http://127.0.0.1:${PORT}`)
        })

        /* ----------------------------- TEST DB MODELS ----------------------------- */
        await addImagesToMenuItemsInDB();
        // const order = await Order.findOne(); 
        // const cancel = order.cancellationDeadlineDate; 
        // const curr = new Date();
        // if (curr > cancel) {
        //     console.log("Cant be cancelled"); 
        // } else {
        //     console.log("CAN be cancelled"); 
        // }
        // console.log(cancel); 
        // const creationDate = new Date(order.createdAt);
        // const cancellationDeadlineDate = dateFns.addMinutes(creationDate, 5);
        // console.log(creationDate, typeof creationDate); 
        // console.log(cancellationDeadlineDate, typeof cancellationDeadlineDate); 

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