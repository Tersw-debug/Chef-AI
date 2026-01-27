const express = require('express');
const router = express.Router();
const {handleUserUpdate, handleGetUser} = require('./controllers/userController');

router.put("/update", handleUserUpdate);

router.get('/getUser', handleGetUser);

module.exports = router;