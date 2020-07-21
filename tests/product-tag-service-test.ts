import { Shop } from '../src/models/Shop';
import { createConnection } from 'typeorm';
import { buildDemoDB } from './my-test';
import { ProductTag } from '../src/models/ProductTag';
import {
    parseShopifyProductTag,
    saveProductTag
} from '../src/services/product-tags.service';
import { expect } from 'chai';

let shop: Shop;

describe('Product tag creation', function () {
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

    it('Creates a product tag', async () => {
        let productTag: ProductTag = new ProductTag();
        productTag.name = 'Tag2';
        productTag = await saveProductTag(productTag);
        expect(productTag.uuid).to.not.be.empty;
    });
});
