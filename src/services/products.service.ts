import * as ShopifyService from '../services/shopify.service';
import { getConnection } from 'typeorm';
import { Product } from '../models/Product';
import { ProductTag } from '../models/ProductTag';
import { logger } from '../utils/logger';

export function save(product: Product) {
    getConnection()
        .manager.save(product)
        .then(x =>
            logger.info('Product has been added to database. ID: ' + x.id)
        );
}

export function saveArr(products: Product[]) {
    getConnection()
        .getRepository(Product)
        .save(products)
        .then(x => logger.info('Saved products to database. IDs: ' + x));
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
    // const productNo = await Product.countProducts();
    if ((await countProducts()) == 0) {
        logger.info('No products in database. Resyncing.'); //TODO: add limit for resyncing.
        await ShopifyService.syncShopify();
    }
    return getConnection().getRepository(Product).find();
}

export async function findProduct(
    productId: number
): Promise<Product | undefined> {
    logger.info('Find product id ' + productId);
    try {
        const res = await getConnection()
            .getRepository(Product)
            .findOne({ where: { shopifyId: productId } }); //Consider findByIds
        return res;
    } catch (e) {
        throw new Error('No record found');
    }
}

export function countProducts(): Promise<number> {
    return getConnection().getRepository(Product).count();
}
