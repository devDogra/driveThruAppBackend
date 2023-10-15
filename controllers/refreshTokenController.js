const jwt = require('jsonwebtoken'); 

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const handleTokenRefresh = (req, res) => {

    const cookies = req.cookies; 
    const refreshToken = cookies?.refreshToken; 
    if (!refreshToken) return res.sendStatus(401); 

    // Verify the RT
    // If it's valid:
        // Get the user to whom this RT belongs, from the payload
        // Make the payload for the new access token
        // Make the new AT
        // Send the new AT
    
    let decodedPayload = null;
    try {
        decodedPayload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
        console.log(err); 
        return res.status(401).json({ error: err.message, message: "Invalid refresh token" });
    }

    // RT is valid, so make a new AT
    const accessToken = jwt.sign({ user: decodedPayload.user, phone: decodedPayload.phone }, ACCESS_TOKEN_SECRET);

    // We wont also send a new RT because that would lead to infinite renewal of RTs ==> infinite access
    res.status(200).json({ success: "Access token refreshed succesfully", accessToken });
}


module.exports = {
    handleTokenRefresh
}