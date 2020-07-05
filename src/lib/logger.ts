// src/lib/logger.ts
 
import appRoot from 'app-root-path';
import { createLogger, transports } from 'winston';
 
const LOG_FILE_PATH = `${appRoot}/logs/app.log`;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
 
// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: LOG_FILE_PATH,
    handleExceptions: true,
    json: true,
    maxsize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};
 
// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});
    
export { logger };