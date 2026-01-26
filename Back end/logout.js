const {handleLogout} = require('./controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/', handleLogout);

module.exports = router;