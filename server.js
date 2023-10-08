require('dotenv').config(); 
const express = require('express'); 
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3500; 
const DB_URI = process.env.DB_URI;

const app = express();

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(DB_URI); 
    console.log("Connected to DB");

    app.listen(PORT, () => {
        console.log(`Listening at http://127.0.0.1:${PORT}`)
    })

}