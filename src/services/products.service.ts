import * as ShopifyService from '../services/shopify.service';
import { getConnection, createQueryBuilder, In, InsertResult } from 'typeorm';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';
import { ProductTag } from '../models/ProductTag';
import {
    findProductTag,
    parseAdditionalProductMetadata,
    parseShopifyProductTags,
    getAllProductTags
} from './product-tags.service';
import Shopify from 'shopify-api-node';

export async function saveProduct(product: Product): Promise<Product> {
    return getConnection().getRepository(Product).save(product);
}

export async function saveProductArr(products: Product[]): Promise<Product[]> {
    const productsRepository = getConnection().getRepository(Product);
    const dbProducts = await findProducts(
        products.map(product => product.shopifyId)
    );
    if (dbProducts.length > 0) {
        products = await Promise.all(
            products.map(newProduct => {
                const dbProduct = dbProducts.find(
                    prod => prod.shopifyId == newProduct.shopifyId
                );
                if (dbProduct) newProduct.id = dbProduct.id;
                return newProduct;
            })
        );
    }
    return productsRepository.save(products);
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

export async function getAllProducts(shopName: string): Promise<Product[]> {
    logger.info('Get all products');
    const productCount = await countProducts();
    if (productCount == 0) {
        logger.info('No products in database. Resyncing.'); //TODO: add limit for resyncing.
        await ShopifyService.syncShopify(shopName);
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

export async function findProducts(productIds: number[]): Promise<Product[]> {
    try {
        logger.info('Find products by ID: ' + JSON.stringify(productIds));
        return getConnection()
            .getRepository(Product)
            .find({
                where: { shopifyId: In(productIds) },
                relations: ['productTags']
            });
    } catch (e) {
        throw new Error('Error finding proudcts');
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
    // res.shopId = 1; //TODO: Process shop ID
    res.productType = prod.product_type;
    res.updated = new Date(prod.updated_at);
    res.productTags = parseShopifyProductTags(productTagsStringArr);
    // Additional tags and metadata:
    res.productTags = res.productTags.concat(
        parseAdditionalProductMetadata(prod)
    );
    return res;
}

// Copies the old product's id and any existing productTags into the new so TypeORM's
// save method updates the object properly (instead of creating duplicates)
export async function mergeProducts(
    dbProduct: Product,
    newProduct: Product
): Promise<Product> {
    newProduct.id = dbProduct.id;
    const allProductTags = await getAllProductTags();
    if (newProduct.productTags && dbProduct.productTags) {
        newProduct.productTags = newProduct.productTags.map(newProductTag => {
            const existingProductTag = allProductTags.find(
                prodTag => prodTag.name == newProductTag.name
            );
            return existingProductTag ? existingProductTag : newProductTag;
        });

        // dbProduct.productTags == newProduct.productTags
        //     ? newProduct.productTags
        //     : dbProduct.productTags;
    }
    return newProduct;
}
