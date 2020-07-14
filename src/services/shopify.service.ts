import _, { trim } from 'lodash';
import Shopify from 'shopify-api-node';
import * as Product from '../models/Product';
import * as ProductTag from '../models/ProductTag';
import * as ProductsService from '../services/products.service';
import * as ProductsTagService from '../services/product-tags.service';
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

export async function parseShopifyProduct(
    prod: Shopify.IProduct
): Promise<Product.Product> {
    const productTagsStringArr = prod.tags.split(',').map(x => x.trim());
    const res = new Product.Product();
    res.shopifyId = prod.id;
    res.name = prod.title;
    res.shopId = 1; //TODO: Process shop ID
    res.productType = prod.product_type;
    res.updated = new Date(prod.updated_at);
    res.productTags = await ProductsTagService.findByProductTagNames(
        productTagsStringArr
    ); //TODO: Scaling problem, maybe inject tags to method?
    return res;
}

export function parseShopifyProductTag(
    productTag: string
): ProductTag.ProductTag {
    const res = new ProductTag.ProductTag();
    res.name = productTag;
    return res;
}

export async function syncShopify() {
    // Consider using Bluebird for Promise.map

    const productList = await shopify.product.list();
    const productTagStringList = productList.map(product =>
        product.tags.split(',').map(tag => tag.trim())
    );
    const uniqueTagStringList = _.chain(productTagStringList) //lodash magic here
        .flatten()
        .uniq()
        .value();
    const uniqueTagList = uniqueTagStringList.map(tagString =>
        parseShopifyProductTag(tagString)
    );
    await ProductsTagService.saveProductTagArr(uniqueTagList);
    logger.info('Product tags synced with Shopify service');

    //TODO: No tags in stored objects
    await ProductsService.saveProductArr(
        await Promise.all(productList.map(x => parseShopifyProduct(x)))
    );
    logger.info('Products synced with Shopify service');
}
