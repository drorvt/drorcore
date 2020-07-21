import { expect, should } from 'chai';
import {
    parseShopifyProduct,
    saveProduct,
    saveProductArr,
    countProducts,
    findProduct
} from '../src/services/products.service';
import { createConnection } from 'typeorm';
import { buildDemoDB } from './my-test';
import { Shop } from '../src/models/Shop';
import { Product } from '../src/models/Product';
import { IProduct } from 'shopify-api-node';
import { ProductTag } from '../src/models/ProductTag';
import { parseShopifyProductTag } from '../src/services/product-tags.service';
import { UnauthorizedError } from 'type-graphql';
require('dotenv').config();

let shop: Shop;

describe('Product creation', function () {
    before(async function () {
        await createConnection({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: ['../src/models/**/*.js', 'src/models/*.js'],
            synchronize: true,
            logging: false
        });
        shop = await buildDemoDB();
    });

    it('Persists a product', async () => {
        let product: Product = new Product();
        product.name = 'Shirt';
        product.productType = 'Cloth';
        product.shop = shop;
        product.shopifyId = 1234;
        product.productTags?.push(parseShopifyProductTag('Tag1'));
        product = await saveProduct(product);
        expect(product.id).to.be.above(0);
        expect(product.productTags?.length).to.be.greaterThan(1);
    });

    it('Persists a product array', async () => {
        let productArr: Product[] = [];
        const product1: Product = new Product();
        product1.name = 'Shirt';
        product1.productType = 'Cloth';
        product1.shop = shop;
        product1.shopifyId = 1234;
        product1.productTags?.push(parseShopifyProductTag('Tag1'));
        const product2: Product = new Product();
        product2.name = 'Jeans';
        product2.productType = 'Pants';
        product2.shop = shop;
        product2.shopifyId = 1234;
        product2.productTags?.push(parseShopifyProductTag('Tag1'));
        productArr.push(product1);

        productArr = await saveProductArr(productArr);
        expect(productArr.length).to.be.greaterThan(1);
    });

    it('Should count all products in the database', function () {
        const productCount = countProducts();
        expect(productCount).to.be.greaterThan(1);
    });

    it('Should return a product by its Shopify id or fail', async function () {
        const product = await findProduct(111);
        if (product) {
            expect(product.id).to.be.greaterThan(0);
        }
    });
});
