const winston = require('winston');
// export const logger = winston.createLogger({
//     level: 'debug',
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'pdq.log' }),
//     ],
//   });

// export const logger = require('pino')();

export const logger = console;