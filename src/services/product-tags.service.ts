import { getConnection, In } from 'typeorm';
import { ProductTag } from '../models/ProductTag';
import { logger } from '../utils/logger';
import { findProduct } from './products.service';
import Shopify from 'shopify-api-node';

export function saveProductTag(productTag: ProductTag): Promise<ProductTag> {
    return getConnection().getRepository(ProductTag).save(productTag);
}

export function saveProductTagArr(
    productTags: ProductTag[]
): Promise<ProductTag[]> {
    return getConnection().getRepository(ProductTag).save(productTags);
}

export function removeProductTag(productTag: ProductTag) {
    getConnection()
        .getRepository(ProductTag)
        .remove(productTag)
        .then(productTag =>
            logger.info(
                'Product tag has been removed from database. ID: ' +
                    productTag.uuid
            )
        );
}

export function updateProductTag(
    productTag: ProductTag,
    newProductTag: ProductTag
) {
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
        .findOne({ where: { id: productTagId } });
    return res;
}

export async function findByProductTagNames(
    tagNames: string[]
): Promise<ProductTag[]> {
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

export async function getProductTagsByProductId(
    productId: number
): Promise<ProductTag[] | null> {
    try {
        const product = await findProduct(productId);
        if (product) {
            return product.productTags;
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

export function parseShopifyProductTag(productTag: string): ProductTag {
    const res = new ProductTag();
    res.name = productTag;
    return res;
}

export function parseShopifyProductTags(
    productTagStrings: string[]
): ProductTag[] {
    return productTagStrings.map(productTag =>
        parseShopifyProductTag(productTag)
    );
}

export function parseAdditionalProductMetadata(
    prod: Shopify.IProduct
): ProductTag[] {
    const res = new Array<ProductTag>();
    res.push(parseShopifyProductTag(prod.product_type));
    res.push(parseShopifyProductTag(prod.vendor));
    // Variants like 'M / Red' and 'L / Red' will not be split:
    prod.variants.map(variant =>
        res.push(parseShopifyProductTag(variant.title))
    );

    return res;
}
