import * as ShopifyService from '../services/shopify.service';
import { getConnection, createQueryBuilder, In } from 'typeorm';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';
import { ProductTag } from '../models/ProductTag';
import {
    findProductTag,
    findByProductTagNames,
    parseShopifyProductTag,
    parseAdditionalProductMetadata,
    parseShopifyProductTags
} from './product-tags.service';
import Shopify from 'shopify-api-node';

export function saveProduct(product: Product): Promise<Product> {
    return getConnection().manager.save(product);
}

export function saveProductArr(products: Product[]): Promise<Product[]> {
    return getConnection().getRepository(Product).save(products);
}

export function removeProduct(product: Product) {
    getConnection()
        .getRepository(Product)
        .remove(product)
        .then(x =>
            logger.info('Product has been removed from database. ID: ' + x.id)
        );
}

export function updateProduct(product: Product, newProduct: Product) {
    getConnection()
        .getRepository(Product)
        .update(product, newProduct)
        .then(x =>
            logger.info(
                'Product has been updated in database. ID: ',
                x.generatedMaps
            )
        );
}

export async function getAllProducts(): Promise<Product[]> {
    logger.info('Get all products');
    const productCount = await countProducts();
    if (productCount == 0) {
        logger.info('No products in database. Resyncing.'); //TODO: add limit for resyncing.
        await ShopifyService.syncShopify();
    }
    const res = await getConnection()
        .getRepository(Product)
        .find({ relations: ['productTags'] });
    return res;
}

export async function getProductsByTagId(
    productTagId: number
): Promise<Product[] | null> {
    try {
        logger.info('Get all products with tag ID ' + productTagId);

        //YB: Best I could do w/ typeORM - finds the products but doesn't nest the ProductTags properly.
        const productTag = await findProductTag(productTagId);
        if (productTag) {
            return getConnection()
                .getRepository(Product)
                .createQueryBuilder()
                .relation(ProductTag, 'products')
                .of(productTag)
                .loadMany();
        } else {
            throw new Error(
                'Error getting products for product tag ' +
                    productTagId +
                    '. Product tag not found.'
            );
        }
    } catch (e) {
        throw new Error('No records found');
    }
}

export async function findProduct(
    productId: number
): Promise<Product | undefined> {
    logger.info('Find product id ' + productId);
    try {
        const res = await getConnection()
            .getRepository(Product)
            .findOne({
                where: { shopifyId: productId },
                relations: ['productTags']
            }); //Consider findByIds
        return res;
    } catch (e) {
        throw new Error('No record found');
    }
}

export function countProducts(): Promise<number> {
    return getConnection().getRepository(Product).count();
}

export async function parseShopifyProduct(
    prod: Shopify.IProduct
): Promise<Product> {
    const productTagsStringArr = prod.tags.split(',').map(x => x.trim());
    const res = new Product();
    res.shopifyId = prod.id;
    res.name = prod.title;
    res.shopId = 1; //TODO: Process shop ID
    res.productType = prod.product_type;
    res.updated = new Date(prod.updated_at);
    res.productTags = parseShopifyProductTags(productTagsStringArr);
    // Additional tags and metadata:
    res.productTags = res.productTags.concat(
        parseAdditionalProductMetadata(prod)
    );
    return res;
}
