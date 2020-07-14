/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from 'express';
import * as ShopifyService from '../services/shopify.service';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';
import { getAllProducts, findProduct } from '../services/products.service';
import {
    findProductTag,
    getProductTags,
    getAllProductTags
} from '../services/product-tags.service';

/**
 * Router Definition
 */
export const shopifyRouter = express.Router();

/**
 * Controller Definitions
 */

// GET items/

shopifyRouter.get(
    '/products/getAllProducts',
    async (req: Request, res: Response) => {
        try {
            // const result = await ShopifyService.getAllProducts();
            res.status(200).send(await getAllProducts());
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

//get product by ID:
shopifyRouter.get(
    '/products/:productId',
    async (req: Request, res: Response) => {
        try {
            //+ parses string to number
            const product: Product | undefined = await findProduct(
                +req.params.productId
            );
            if (product) {
                res.status(200).send(product);
            } else {
                res.status(500).send('Product not found');
            }
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

shopifyRouter.get('/tags/getAllTags', async (req: Request, res: Response) => {
    try {
        const tags = await getAllProductTags();
        res.status(200).send(tags);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

//get all tags for product
shopifyRouter.get('/tags/:productId', async (req: Request, res: Response) => {
    try {
        const productId = +req.params.productId;
        if (productId) {
            const tags = await getProductTags(productId);
            res.status(200).send(tags);
        } else {
            res.status(400).send('Invalid product ID');
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

//   // POST items/

//   // PUT items/

//   // DELETE items/:id
