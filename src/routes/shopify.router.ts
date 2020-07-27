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
import { Shop } from '../models/Shop';

/**
 * Router Definition
 */
export const shopifyRouter = express.Router();

/**
 * Controller Definitions
 */

// GET items/
// Product methods:
// Get all products:
shopifyRouter.get(
    '/products/getAllProducts',
    authorize('read'),
    async (req: Request, res: Response) => {
        try {
            res.status(200).send(await getAllProducts((req as any).user.store));
        } catch (e) {
            handleError(res, e.message, 404, 'Get all products');
        }
    }
);

// Get products by tag:
shopifyRouter.get(
    '/products/getProductsByTag',
    authorize('read'),
    async (req: Request<{}, {}, number>, res: Response) => {
        try {
            const productTagId = req.body;
            const shop: Shop = (req as any).user.store;
            if (productTagId) {
                const tags = await getProductsByTagId(productTagId, shop);
                res.status(200).send(tags);
            } else {
                handleError(
                    res,
                    'No products found',
                    500,
                    'Get products by tag'
                );
            }
        } catch (e) {
            handleError(res, e.message, 404, 'Get products by tag');
        }
    }
);

//get product by ID:
shopifyRouter.get(
    '/products/getProductById',
    authorize('read'),
    async (req: Request<{}, {}, number>, res: Response) => {
        try {
            const productId = req.body;
            const shop: Shop = (req as any).user.store;
            if (productId) {
                const product: Product | undefined = await findProduct(
                    productId,
                    shop
                );
                if (product) {
                    res.status(200).send(product);
                } else {
                    handleError(
                        res,
                        'No products found',
                        500,
                        'Get product by ID'
                    );
                }
            } else {
                handleError(
                    res,
                    'Invalid product ID',
                    400,
                    'Get product by ID'
                );
            }
        } catch (e) {
            handleError(res, e.message, 404, 'Get product by ID');
        }
    }
);

// ProductTag methods:
// Get all product tags:
shopifyRouter.get(
    '/tags/getAllTags',
    authorize('read'),
    async (req: Request, res: Response) => {
        try {
            const shop: Shop = (req as any).user.store;
            const tags = await getAllProductTags(shop);
            res.status(200).send(tags);
        } catch (e) {
            handleError(res, e.message, 404, 'Get all product tags');
        }
    }
);

// Get all tags for product:
shopifyRouter.get(
    '/tags/getTagsByProduct',
    authorize('read'),
    async (req: Request<{}, {}, number>, res: Response) => {
        try {
            const productId = req.body;
            const shop: Shop = (req as any).user.store;
            if (productId) {
                const tags = await getProductTagsByProductId(productId, shop);
                res.status(200).send(tags);
            } else {
                handleError(
                    res,
                    'Invalid product ID',
                    400,
                    'Get all tags for product'
                );
            }
        } catch (e) {
            handleError(res, e.message, 404, 'Get all tags for product');
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
            ShopifyService.syncProduct(product, (req as any).user.store);
        } catch (e) {
            handleError(res, e.message, 404, 'Sync Shopify product');
        }
    }
);

// Sync products:
shopifyRouter.post(
    '/products/syncArr',
    authorize('read'),
    async (req: Request, res: Response) => {
        try {
            const products: Product[] = req.body.products;
            ShopifyService.syncProductArr(products, (req as any).user.store);
        } catch (e) {
            handleError(res, e.message, 404, 'Sync Shopify products');
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
            await ShopifyService.syncShopify((req as any).user.store);
            res.status(200).send();
        } catch (e) {
            handleError(res, e.message, 404, 'Sync all shopify products');
        }
    }
);

// DELETE items/
// Delete product tag
shopifyRouter.delete(
    '/tags',
    authorize('read'),
    async (req: Request<{}, {}, number>, res: Response) => {
        try {
            const productTagId = req.body;
            const shop: Shop = (req as any).user.store;
            if (productTagId) {
                const productTag: ProductTag | undefined = await findProductTag(
                    productTagId,
                    shop
                );
                if (productTag) {
                    removeProductTag(productTag);
                    res.status(200).send(productTag);
                } else {
                    handleError(
                        res,
                        'Invalid productTag ID',
                        400,
                        'Delete product tag'
                    );
                }
            } else {
                handleError(
                    res,
                    'Invalid productTag ID',
                    400,
                    'Delete product tag'
                );
            }
        } catch (e) {
            handleError(res, e.message, 404, 'Delete product tag');
        }
    }
);

// Delete product
shopifyRouter.delete(
    '/products',
    authorize('read'),
    async (req: Request<{}, {}, number>, res: Response) => {
        try {
            const productId = req.body;
            const shop: Shop = (req as any).user.store;
            if (productId) {
                const product: Product | undefined = await findProduct(
                    productId,
                    shop
                );
                if (product) {
                    removeProduct(product);
                    res.status(200).send(product);
                } else {
                    handleError(
                        res,
                        'No products found',
                        500,
                        'Delete product'
                    );
                }
            } else {
                handleError(res, 'Invalid product ID', 400, 'Delete product');
            }
        } catch (e) {
            handleError(res, e.message, 404, 'Delete product');
        }
    }
);
