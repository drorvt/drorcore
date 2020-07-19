import express, { Response } from 'express';
import { logger } from '../utils/logger';

export const handleError = (res: Response, message:string, code:number, cause:any):void => {
    logger.error(message, cause);
    res.status(code).send(message);
}