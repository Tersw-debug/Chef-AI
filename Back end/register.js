const express = require('express');
const router = express.Router();

const handleNewUser = require('./controllers/userController.js');

router.post('/', handleNewUser);

module.exports = router;