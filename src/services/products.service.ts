import * as ShopifyService from '../services/shopify.service';
import { getConnection } from 'typeorm';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';

export function save(product: Product): Promise<Product> {
    return getConnection().manager.save(product);
}

export function saveArr(products: Product[]): Promise<Product[]> {
    return getConnection().getRepository(Product).save(products);
}

export function remove(product: Product) {
    getConnection()
        .getRepository(Product)
        .remove(product)
        .then(x =>
            logger.info('Product has been removed from database. ID: ' + x.id)
        );
}

export function update(product: Product, newProduct: Product) {
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
    return getConnection()
        .getRepository(Product)
        .find({ relations: ['productTags'] });
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
