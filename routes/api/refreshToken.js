const express = require('express'); 
const router = express.Router(); 
const refreshTokenController = require('../../controllers/refreshTokenController')

router.route('/')
    .post(refreshTokenController.handleTokenRefresh);

module.exports = router; 