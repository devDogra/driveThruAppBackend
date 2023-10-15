const User = require('../models/User');

const handleLogin = async (req, res) => {
    const user = await User.findByPhoneNumber(9811061693);
    res.status(200).json({
        message: "Hello this is the /login route",
        user
    })
}

module.exports = {
    handleLogin,
}