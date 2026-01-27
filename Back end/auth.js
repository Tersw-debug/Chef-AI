const express = require('express');
const router = express.Router();

const {handleLogin} = require('./controllers/authController');
const loginLimiter = require('./middleware/loginLimiter');
router.post('/', loginLimiter,handleLogin);

module.exports = router;
