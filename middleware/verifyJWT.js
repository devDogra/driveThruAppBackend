const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyJWT = async (req, res, next) => {
    const Authorization = req.headers['authorization'];
    if (!Authorization) return res.status(401).json({ error: "No Authorization header" })

    const [ scheme, accessToken ] = Authorization.split(' ');
    if (scheme !== "Bearer") return res.status(401).json({ error: "Bearer scheme not used" });
    console.log({accessToken}); 

    // BETTER: try/catch with throwing custom errors, so that
    // all the code can be wrapped in one try/catch block
    let decodedPayload = null;

    try {
        decodedPayload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch(err) {
        console.log(err); 
        return res.status(401).json({ error: err.message, message: "Invalid access token" }); 
    }    

    // FUTURE: Get user's role from DB, here, and set that
    // on the req too
    // req.user is the user's ID
    // Why not just set req.user to the whle user then?
    const userId = decodedPayload.user; 
    let user = null;
    try {
        user = await User.findById(userId)
        if (!user) return res.status(401).json({ errror: "The JWT belongs to a non-existant user. Please login again" });
        req.user = user; 
    } catch(err) {
        console.log(err); 
        return res.status(400).json({error: err.message, message: "Could not find user with whom this JWT is associated"})
    }
    
    console.log("AUTHENTICATION succesful"); 
    console.log({user: req.user}); 
    next(); 


}

module.exports = verifyJWT;