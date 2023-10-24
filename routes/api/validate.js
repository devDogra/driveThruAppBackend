const express = require('express'); 
const verifyJWT = require('../../middleware/verifyJWT');
const router = express.Router(); 


router.route('/')
    .post((req, res) => {
        return res.status(200).json({
            isLoggedIn: true, 
            user: req.user, 
        })
    })

module.exports = router; 