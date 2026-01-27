const express = require('express');
const router = express.Router();
const {handleReVerification} = require('./controllers/userController');

router.post('/', handleReVerification);

module.exports = router;
