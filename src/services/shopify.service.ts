import Shopify from 'shopify-api-node';
import { Product } from "../models/product";

/**
 * In-Memory Store
 */

const products: Product[] = [{ id: 1 }, { id: 2 }];

const shopify = new Shopify({
  shopName: 'pdqv1-testing',
  apiKey: 'cce3116572a7074529524513c23fc735',
  password: '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'
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
