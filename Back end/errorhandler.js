const { logEvents } = require("./log/log");

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'log.txt');

    res.status(500).json({
        message: err.message
    });
};

module.exports = errorHandler;