import _, { trim } from 'lodash';
import Shopify from 'shopify-api-node';
import * as Product from '../models/Product';
import * as ProductTag from '../models/ProductTag';
import * as ProductsService from '../services/products.service';
import * as ProductTagsService from '../services/product-tags.service';
import { logger } from '../utils/logger';
import { getShopify } from '../managers/shopify.manager';
import { Shop } from '../models/Shop';

/**
 * In-Memory Store
 */

/**
 * Service Methods
 */

// Sync all Shopify products and tags
export async function syncShopify(shop: Shop) {
    // Consider using Bluebird for Promise.map
    const shopify = getShopify(shop);
    const productList = await shopify.product.list();

    await ProductsService.saveProductArr(
        await Promise.all(
            productList.map(shopifyProduct =>
                ProductsService.parseShopifyProduct(shopifyProduct, shop)
            )
        ),
        shop
    );
    logger.info('Products synced with Shopify service');
}

//Sync single product
export async function syncProduct(prod: Product.Product, shop: Shop) {
    logger.info(
        'Syncing product with Shopify service. Product Shopify ID: ' +
            prod.shopifyId
    );
    const shopify = getShopify(shop);

    shopify.product
        .get(prod.shopifyId)
        .then(product => ProductsService.parseShopifyProduct(product, shop))
        .then(fetchedProduct => ProductsService.saveProduct(fetchedProduct));
}

// Sync product array
export async function syncProductArr(products: Product.Product[], shop: Shop) {
    logger.info(
        'Syncing product with Shopify service. Product Shopify ID: ' +
            JSON.stringify(products)
    );
    const shopify = getShopify(shop);

    const productIds = products.map(prod => prod.shopifyId);
    const allProducts = shopify.product.list();
    const productsToUpdate = (await allProducts).filter(
        product => productIds.indexOf(product.id) > -1
    );
    ProductsService.saveProductArr(
        await Promise.all(
            productsToUpdate.map(shopifyProduct =>
                ProductsService.parseShopifyProduct(shopifyProduct, shop)
            )
        ),
        shop
    );
}
