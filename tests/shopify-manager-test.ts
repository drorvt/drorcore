import { Shop } from '../src/models/Shop';
import { createConnection } from 'typeorm';
import { buildDemoDB } from './my-test';
import Shopify from 'shopify-api-node';
import { expect } from 'chai';
import { getShopify } from '../src/managers/shopify.manager';
require('dotenv').config();

let shop: Shop;

describe('Order Creations', function () {
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

    it('Creates a Shopify object', async () => {
        const shopify = getShopify(shop);
        expect(shopify.shop).to.not.be.empty;
    });
});
