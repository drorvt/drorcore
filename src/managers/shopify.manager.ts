import Shopify from 'shopify-api-node';
import { Shop } from '../models/Shop';

const shopifyApis: { [shopId: number]: Shopify } = {};

export function getShopify(shop: Shop): Shopify {
    const res: Shopify = shopifyApis[shop.id];
    if (res) {
        return res;
    }
    //TODO: Get api keys from db?
    return new Shopify({
        shopName: process.env.SHOPIFY_SHOP_NAME || '',
        apiKey: process.env.SHOPIFY_API_KEY || '',
        password: process.env.SHOPIFY_API_PASSWORD || ''
    });
}
