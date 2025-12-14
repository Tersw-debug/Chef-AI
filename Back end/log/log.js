const path = require('path');
const {v4: uuid} = require('uuid');
const filePromise = require('fs/promises');
const file = require('fs');
const {format} = require('date-fns');



const logEvents = async (message, logName) =>{
    const time = `${format(new Date(),'yyyy-MM-dd\tHH-mm-ss')}`;
    const log = `${message}\t${uuid()}\t${time}\n`;
    try{
        if(!file.existsSync(path.join(__dirname,'..','log')))
            await filePromise.mkdir(path.join(__dirname, '..','log'));

        await filePromise.appendFile(path.join(__dirname,'..','log',logName) ,log);
    }
    catch(e){
        console.log(e)
    }


}

const logger = (req, res, next) => {
    const origin = req.headers.origin || 'unknown';
    logEvents(`${req.method}\t${origin}\t${req.url}`, 'log.txt')
        .catch(err => console.error('Logging error:', err));
    console.log(`${req.method}\t${req.path}`);
    next()
};

module.exports = { logger , logEvents }