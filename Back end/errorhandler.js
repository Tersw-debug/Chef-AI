const {logger, logEvents} = require("./log/log");

const errorHandler = async (err,req,res,next) =>{
    logEvents(`${err.name}:${err.message}`, 'log.txt');
    next()
}

module.exports = errorHandler