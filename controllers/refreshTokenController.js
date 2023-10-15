const handleTokenRefresh = (req, res) => {

    const cookies = req.cookies.refreshToken; 
    console.log({cookies}); 
    res.send("HELLO from /refreshToken");
}


module.exports = {
    handleTokenRefresh
}