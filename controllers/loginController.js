const bcrypt = require('bcrypt'); 
const User = require('../models/User');

const handleLogin = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findByPhoneNumber(phone);
        if (!user) return res.status(404).json({ error: "No user with the given phone number exists" });

        const hashedPassword = user.password; 
        const matches = await bcrypt.compare(password, hashedPassword);
        if (!matches) return res.status(401).json({ error: "Incorrect password" });

        // Login successful
        return res.status(200).json({ success: "Login succesful" });
    } catch(err) {
        console.log(err.message); 
        return res.status(400).json({ error: err.message, message: "Could not login" });
    }
    
}

module.exports = {
    handleLogin,
}