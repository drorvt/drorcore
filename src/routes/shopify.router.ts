/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from 'express';
import { query, check, validationResult } from 'express-validator/check';

import * as ShopifyService from '../services/shopify.service';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';
import { handleError } from '../utils/error-handler';
import {
    getAllProducts,
    findProduct,
    getProductsByTagId,
    removeProduct
} from '../services/products.service';
import {
    findProductTag,
    getProductTagsByProductId,
    getAllProductTags,
    removeProductTag
} from '../services/product-tags.service';
import { ProductTag } from '../models/ProductTag';
import e from 'express';
import { FindOperator } from 'typeorm';
import authorize from '../services/authorization.service';

/**
 * Router Definition
 */
export const shopifyRouter = express.Router();

/**
 * Controller Definitions
 */

// GET items/
// Product methods:
shopifyRouter.get(
    '/products/getAllProducts',
    authorize('read'),
    async (req: Request, res: Response) => {
        try {
            // const result = await ShopifyService.getAllProducts();
            res.status(200).send(await getAllProducts());
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

// Get products by tag:
shopifyRouter.get(
    '/products',
    [query('productTagId').notEmpty().isNumeric()],
    authorize('read'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() }).send();
        }
        try {
            if (req.query.productTagId) {
                //+ parses string to number
                const productTagId = +req.query.productTagId;
                if (productTagId) {
                    const tags = await getProductsByTagId(productTagId);
                    res.status(200).send(tags);
                } else {
                    res.status(500).send('Products not found');
                }
            } else {
                res.status(400).send('Invalid product ID');
            }
        } catch (e) {
            handleError(res, e.message, 404, e);
        }
    }
);

//get product by ID:
shopifyRouter.get(
    '/products',
    [query('productId').notEmpty().isNumeric()],
    authorize('read'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() }).send();
        }
        try {
            if (req.query.productId) {
                //+ parses string to number
                const product: Product | undefined = await findProduct(
                    +req.query.productId
                );
                if (product) {
                    res.status(200).send(product);
                } else {
                    res.status(500).send('Product not found');
                }
            } else {
                res.status(400).send('Invalid product ID');
            }
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

//ProductTag methods:
shopifyRouter.get(
    '/tags/getAllTags',
    authorize('read'),
    async (req: Request, res: Response) => {
        try {
            const tags = await getAllProductTags();
            res.status(200).send(tags);
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

//get all tags for product
shopifyRouter.get(
    '/tags',
    [query('productId').notEmpty().isNumeric()],
    authorize('read'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() }).send();
        }
        try {
            if (req.query.productId) {
                const productId = +req.query.productId;
                if (productId) {
                    const tags = await getProductTagsByProductId(productId);
                    res.status(200).send(tags);
                } else {
                    res.status(400).send('Invalid product ID');
                }
            } else {
                res.status(400).send('Invalid product ID');
            }
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

// POST items/
//TODO: Can we overload these?
// Sync product:
shopifyRouter.post(
    '/products/sync',
    authorize('read'),
    async (req: Request, res: Response) => {
        try {
            const product: Product = req.body.product;
            ShopifyService.syncProduct(product);
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);
// Sync products:
shopifyRouter.post(
    '/products/syncArr',
    authorize('read'),
    async (req: Request, res: Response) => {
        try {
            const products: Product[] = req.body.product;
            ShopifyService.syncProductArr(products);
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

// (Should be POST or GET?)
// Sync all:
shopifyRouter.post(
    '/sync',
    authorize('read'),
    async (req: Request, res: Response) => {
        try {
            await ShopifyService.syncShopify();
            res.status(200).send();
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

//Update product tag

//   // PUT items/

// DELETE items/
//Delete product tag
shopifyRouter.delete(
    '/tags',
    [query('productTagId').notEmpty().isNumeric()],
    authorize('read'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() }).send();
        }
        try {
            if (req.query.productTagId) {
                const productTag: ProductTag | undefined = await findProductTag(
                    +req.query.productTagId
                );
                if (productTag) {
                    removeProductTag(productTag);
                    res.status(200).send(productTag);
                } else {
                    res.status(400).send('Invalid productTag ID');
                }
            } else {
                res.status(400).send('Invalid productTag ID');
            }
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);

// Delete product
shopifyRouter.delete(
    '/products',
    [query('productId').notEmpty().isNumeric()],
    authorize('read'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() }).send();
        }
        try {
            if (req.query.productId) {
                //+ parses string to number
                const product: Product | undefined = await findProduct(
                    +req.query.productId
                );
                if (product) {
                    removeProduct(product);
                    res.status(200).send(product);
                } else {
                    res.status(500).send('Product not found');
                }
            } else {
                res.status(400).send('Invalid productTag ID');
            }
        } catch (e) {
            res.status(404).send(e.message);
        }
    }
);
