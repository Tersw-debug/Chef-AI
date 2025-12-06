const express = require('express');
const app = express();
const path = require('path');
const errorHandler = require('./errorhandler');
const {logger, logEvents} = require('./log/log');
const credentials = require('./credentials');
process.loadEnvFile('.env');
const port = process.env.PORT;

app.use(logger);
app.use(credentials);

app.use(express.urlencoded());

app.use(express.json());


app.use(errorHandler);
app.get('/', (req,res) => {
    res.send("Logger is active");
});

app.listen(port, () => console.log(`The Server is running at ${port}`));