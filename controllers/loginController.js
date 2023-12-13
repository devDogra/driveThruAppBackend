const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const handleLogin = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) return res.status(401).json({ error: "Phone number and password are required" }); 

    try {
        const user = await User.findByPhoneNumber(phone);
        console.log({user}); 
        if (!user) return res.status(404).json({ error: "No user with the given phone number exists" });

        const hashedPassword = user.password; 
        console.log({ password, hashedPassword }); 
        const matches = await bcrypt.compare(password, hashedPassword);
        if (!matches) return res.status(401).json({ error: "Incorrect password" });

        // Login successful
        const payload = {
            user: user._id,
            phone: user.phone,
        }
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '12h'});
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '1d'});

        // httpOnly: true for more security; 
        // No script accesss to evil.com won't be able to send requests to our.com and have the RT cookie be included in them
        const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
        // Secure: false set because true => cookies only sent on HTTPS
        // no cookies were being sent, so I had no way for the /refreshToken
        // route to access the cookies! 
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: ONE_DAY_IN_MS, secure: false, /*true*/ });

        return res.status(200).json({
            accessToken,
            success: "Login succesful",
        })

    } catch(err) {
        console.log(err); 
        return res.status(400).json({ error: err.message, message: "Could not login" });
    }
    
}

module.exports = {
    handleLogin,
}