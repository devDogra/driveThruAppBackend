const jwt = require('jsonwebtoken'); 
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyJWT = (req, res, next) => {
    const Authorization = req.headers['authorization'];
    if (!Authorization) return res.status(401).json({ error: "No Authorization header" })

    const [ scheme, accessToken ] = Authorization.split(' ');
    if (scheme !== "Bearer") return res.status(401).json({ error: "Bearer scheme not used" });

    try {
        const decodedPayload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        req.user = decodedPayload.user; 
        console.log({accessToken}); 
        console.log(req.user); 
        // FUTURE: Get user's role from DB, here, and set that
        // on the req too
        console.log("AUTHENTICATION succesful"); 
        next(); 
    } catch(err) {
        console.log(err); 
        return res.status(401).json({ error: "Invalid access token" }); 
    }    

}

module.exports = verifyJWT;