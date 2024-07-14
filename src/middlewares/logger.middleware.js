import fs from "fs";
import winston from "winston";

// //Below code is to create logger using fs module
// const fsPromise = fs.promises;

// async function log(logdata) {
//     try {
//         logdata = `${new Date().toString()} - ${logdata}\n`
//         // await fsPromise.writeFile("log.txt", logdata) // this will override the existing data, so it's better to use appendFile
//         await fsPromise.appendFile("log.txt", logdata)
//     }catch(err) {
//         console.log(err)
//     }
// }

//Below code is to create logger using winston library
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "request-logging" },
    transports: [
        new winston.transports.File({filename: "logs.txt"})
    ]
})

//This is the middleware which we can use in server file or in the requests as midddleware
const loggerMiddleware = async (req, res, next) => {
    // 1. Log request body
    if(req.url.includes('signin') || req.url.includes('signup')) {
        
    }else {
        const logData = `${req.url} - ${JSON.stringify(req.body)}`
        // await log(logData); //This is for fs module
        logger.info(logData)
    }
    next();
}

export default loggerMiddleware;