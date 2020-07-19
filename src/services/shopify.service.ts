import _, { trim } from 'lodash';
import Shopify from 'shopify-api-node';
import * as Product from '../models/Product';
import * as ProductTag from '../models/ProductTag';
import * as ProductsService from '../services/products.service';
import * as ProductTagsService from '../services/product-tags.service';
import { logger } from '../utils/logger';

/**
 * In-Memory Store
 */

// const products: Product[] = [{ id: 1 }, { id: 2 }];
const shopify = new Shopify({
    shopName: process.env.SHOPIFY_SHOP_NAME || '',
    apiKey: process.env.SHOPIFY_API_KEY || '',
    password: process.env.SHOPIFY_API_PASSWORD || ''
});

/**
 * Service Methods
 */

// Sync all Shopify products and tags
export async function syncShopify() {
    // Consider using Bluebird for Promise.map

    const productList = await shopify.product.list();

    await ProductsService.saveProductArr(
        await Promise.all(
            productList.map(shopifyProduct =>
                ProductsService.parseShopifyProduct(shopifyProduct)
            )
        )
    );
    logger.info('Products synced with Shopify service');
}

//Sync single product
export async function syncProduct(prod: Product.Product) {
    logger.info(
        'Syncing product with Shopify service. Product Shopify ID: ' +
            prod.shopifyId
    );
    shopify.product
        .get(prod.shopifyId)
        .then(product => ProductsService.parseShopifyProduct(product))
        .then(fetchedProduct => ProductsService.saveProduct(fetchedProduct));
}

// Sync product array
export async function syncProductArr(products: Product.Product[]) {
    logger.info(
        'Syncing product with Shopify service. Product Shopify ID: ' +
            JSON.stringify(products)
    );
    const productIds = products.map(prod => prod.shopifyId);
    const allProducts = shopify.product.list();
    const productsToUpdate = (await allProducts).filter(
        product => productIds.indexOf(product.id) > -1
    );
    ProductsService.saveProductArr(
        await Promise.all(
            productsToUpdate.map(shopifyProduct =>
                ProductsService.parseShopifyProduct(shopifyProduct)
            )
        )
    );
}
