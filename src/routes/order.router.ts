import { query, validationResult } from 'express-validator';
import authorize from '../services/authorization.service';
import express, { Request, Response } from 'express';
import { handleError } from '../utils/error-handler';
import { Shop } from '../models/Shop';
import { getOrder, getOrders } from '../services/order.service';

export const orderRouter = express.Router();

// GET items/
// Get orders:
orderRouter.post(
    '/getOrders',
    authorize('read'),
    async (req: any, res: Response) => {
        try {
            res.status(200).send(
                await getOrders(req.body.queryParameters, req.user.store)
            );
        } catch (e) {
            handleError(res, e.message, 404, 'Get orders');
        }
    }
);
