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

// DB
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

app.get('/', (req, res) => {
    res.send("Logger is active");
});


app.use(errorHandler);


app.listen(port, () =>
    console.log(`The Server is running at ${port}`)
);