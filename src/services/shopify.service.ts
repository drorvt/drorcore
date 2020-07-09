import Shopify from 'shopify-api-node';
import { Product } from '../models/Product';
import { getConnection } from 'typeorm';
import { ProductTag } from '../models/ProductTag';

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

function convertShopifyProductList(arr: Shopify.IProduct[]): Product[] {
    return arr.map(x => {
        return convertShopifyProduct(x);
    });
}

function convertShopifyProduct(prod: Shopify.IProduct): Product {
    return {
        id: prod.id,
        name: prod.title,
        shopId: 1, //TODO: Process shop ID
        productType: prod.product_type,
        updated: new Date(prod.updated_at),
        productTags: prod.tags
            .split(',')
            .map(x => x.trim())
            .map(x => new ProductTag(x))
    };
}

export const syncProducts = async () => {
    return convertShopifyProductList(
        await shopify.product.list({ limit: 250 })
    );
};

export const getAllProducts = async (): Promise<Product[]> => {
    return convertShopifyProductList(
        await shopify.product.list({ limit: 250 })
    );
};

export const findProduct = async (productId: number): Promise<Product> => {
    try {
        return convertShopifyProduct(await shopify.product.get(productId));
    } catch (e) {
        throw new Error('No record found');
    }
};

export const getProductTags = (productId: number): Promise<String[]> => {
    try {
        // split and trim tags
        return shopify.product
            .get(productId)
            .then(x => x.tags.split(',').map(i => i.trim()));
    } catch (e) {
        throw new Error('Error getting tags for product ' + productId);
    }
};

export const getAllTags = async (): Promise<String[]> => {
    try {
        // get all tags, split, trim, and flatten
        const tags = (await shopify.product.list())
            .map(x => x.tags.split(',').map(x => x.trim()))
            .reduce((x, y) => x.concat(y), []);

        // return unique values:
        return tags.filter(function (item, pos, self) {
            return self.indexOf(item) == pos;
        });
    } catch (e) {
        throw new Error('Error getting tags');
    }
};
