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
const { saltRounds } = require('./config/bcryptConfig.json');
const populateAccounts = require('./dbscripts/populateAccounts');
const populateMenuItems = require('./dbscripts/populateMenuItems');
const populateOrders = require('./dbscripts/populateOrders');


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
    validate: require('./routes/api/validate'),
    uploadImage: require('./routes/api/uploadImage')
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
app.use('/uploadImage', routers.uploadImage);

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

        /* ----------------------------- TEST DB MODELS/RUN SCRIPTS --------------- */
        // Create sample users
        const User = mongoose.model("User")
        await User.deleteMany({}); 
        await populateAccounts();
        
        // Create menu items
        const MenuItem = mongoose.model("MenuItem");
        await MenuItem.deleteMany({});
        await populateMenuItems();
        
        const Order = mongoose.model("Order"); 
        await Order.deleteMany({});
        await populateOrders();  
        /* -------------------------------------------------------------------------- */
    
        /* -------------------------------------------------------------------------- */

    } catch(err) {
        console.log("ERROR: ");
        console.log(err.message); 
        console.log("Restart server"); 
        process.exit()
    }


}