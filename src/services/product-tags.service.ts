import { getConnection, In } from 'typeorm';
import { ProductTag } from '../models/ProductTag';
import { logger } from '../utils/logger';
import { findProduct } from './products.service';

export function save(productTag: ProductTag): Promise<ProductTag> {
    return getConnection().getRepository(ProductTag).save(productTag);
}

export function saveArr(productTags: ProductTag[]): Promise<ProductTag[]> {
    return getConnection().getRepository(ProductTag).save(productTags);
}

export function remove(productTag: ProductTag) {
    getConnection()
        .getRepository(ProductTag)
        .remove(productTag)
        .then(x =>
            logger.info(
                'Product tag has been removed from database. ID: ' + x.id
            )
        );
}

export function update(productTag: ProductTag, newProductTag: ProductTag) {
    getConnection()
        .getRepository(ProductTag)
        .update(productTag, newProductTag)
        .then(x =>
            logger.info(
                'Product tag has been updated in database. ID: ' +
                    x.generatedMaps
            )
        );
}

export async function findProductTag(
    productTagId: number
): Promise<ProductTag | undefined> {
    const res = await getConnection()
        .getRepository(ProductTag)
        .findOne({ id: productTagId });
    return res;
}

export async function findByNames(tagNames: string[]): Promise<ProductTag[]> {
    const res = await getConnection()
        .getRepository(ProductTag)
        .find({
            name: In(tagNames)
        });
    return res;
}

export function getAllProductTags(): Promise<ProductTag[]> {
    return getConnection().getRepository(ProductTag).find();
}

export async function getProductTags(
    productId: number
): Promise<ProductTag[] | null> {
    try {
        const res = await findProduct(productId);
        if (res) {
            return res.productTags;
        } else {
            throw new Error(
                'Error getting tags for product ' +
                    productId +
                    '. Product not found.'
            );
        }
    } catch (e) {
        throw new Error('Error getting tags for product ' + productId);
    }
}
