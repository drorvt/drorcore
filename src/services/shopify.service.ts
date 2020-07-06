import Shopify from 'shopify-api-node';
import { Product } from "../models/product";

/**
 * In-Memory Store
 */

const products: Product[] = [{ id: 1 }, { id: 2 }];

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME || '',
  apiKey: process.env.SHOPIFY_API_KEY || '',
  password: process.env.SHOPIFY_API_PASSWORD || ''
});

/**
 * Service Methods
 */

export const findAll = async (): Promise<Product[]> => {
  return products;
};

export const find = async (id: number): Promise<Product> => {
  const record: Product = products.find((i) => i.id === id)!;

  if (record) {
    return record;
  }

  throw new Error("No record found");
};
