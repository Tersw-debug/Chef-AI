const express = require('express');
const mongoose = require("mongoose");
const app = express();
const errorHandler = require('./errorhandler');
const { logger } = require('./log/log');
const credentials = require('./credentials');
require('dotenv').config();
const cors = require('cors');
const corsOptions = require('./config/cors');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 4000;
const verfiyJWT = require('./middleware/verifyJWT');
const quota = require("./middleware/quota");
const {verifyEmail} = require('./controllers/authController');
const dns = require('dns');
const axios = require('axios');
// DB

dns.setServers(['8.8.8.8', '8.8.4.4']); 
mongoose.connect(process.env.mongoDB)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Middleware
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/register', require('./register'));
app.use('/auth', require('./auth'));
app.use('/refresh', require('./refreshToken'));
app.use('/logout', require('./logout'));


app.use('/verification', require('./verification'));


app.get('/verifyemail/:verificationToken', verifyEmail, async (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'email-verified.html'));
});


app.post("/generate", quota, async (req,res) => {
    console.log("got things", req.body); //Change this to call your model bro
    try{
        const prompt = req.body;
        const response = await axios.post("http://localhost:8000/generate", prompt, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        res.status(200).json(response.data);
    }catch(err){
        console.error("Error communicating with model API: ", err.message);

        const status = err.response ? err.response.status : 500;
        const message = err.response ? err.response.data : "Internal server error";

        res.status(status).json({err: message});
    }

});

app.use('/password', require('./resetpassword'));

app.use(verfiyJWT);

app.use('/profile', require('./profile'));


app.use(errorHandler);


app.listen(port, () =>
    console.log(`The Server is running at ${port}`)
);