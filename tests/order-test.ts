import { createCarrier } from './../src/services/order.service';
const expect = require('chai').expect;
import { initDB, buildDemoDB } from './my-test';
import { createConnection, Connection } from 'typeorm';
import { User } from '../src/models/User';
import { createUser, findUser } from '../src/services/user.service';
import * as orderService from '../src/services/order.service';
import * as productService from '../src/services/products.service';
import { assert } from 'chai';
import { Carrier } from '../src/models/Carrier';
import { Order } from '../src/models/Order';
import { Shop } from '../src/models/Shop';
import { OrderItem } from '../src/models/OrderItem';
import { Product } from '../src/models/Product';
import { QueryParameters } from '../src/typings/QueryParameters';

var shop: Shop;

describe('Order Creations', function () {
    var con:Connection|undefined;

    beforeEach(async function () {
        if (con){
            await con.close();
        }
        con = await createConnection({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: ['../src/models/**/*.js', 'src/models/*.js'],
            synchronize: true,
            logging: true
        });
        shop = await buildDemoDB();
    });

    it('Creates a Carrier', async () => {
        let carrier: Carrier = new Carrier();
        carrier.name = 'Fedex';
        carrier = await createCarrier(carrier);
        expect(carrier?.id).to.be.above(0);
    });

    it('Creates an empty Order', async () => {
        let carrier: Carrier = new Carrier();
        carrier.name = 'Fedex';
        carrier = await createCarrier(carrier);

        let order: Order = new Order();
        order.shop = shop;
        order.address = 'tel aviv';
        order.radius = 2;
        order.expected = new Date();
        order = await orderService.createOrder(order);
        expect(order?.id).to.be.above(0);
    });

    it('Adds items to an Order', async () => {
        let carrier: Carrier = new Carrier();
        carrier.name = 'Fedex';
        carrier = await createCarrier(carrier);

        let order: Order = new Order();
        order.shop = shop;
        order.address = 'tel aviv';
        order.radius = 2;
        order.expected = new Date();
        order = await orderService.createOrder(order);

        const products: Product[] = await productService.getAllProducts(shop);
        await orderService.addItemToOrder(order, products[0], 5);
        await orderService.addItemToOrder(order, products[0], 4);
        await orderService.addItemToOrder(order, products[1], 8);
        const storedOrder: Order | undefined = await orderService.getOrder(
            order.id
        );
        expect(storedOrder?.items.length).to.equal(3);
    });

    it('Filter orders list', async () => {
        let carrier: Carrier = new Carrier();
        carrier.name = 'Fedex';
        carrier = await createCarrier(carrier);

        let order: Order = new Order();
        order.shop = shop;
        order.address = 'tel aviv';
        order.radius = 1;
        order.expected = new Date();
        order = await orderService.createOrder(order);

        order = new Order();
        order.shop = shop;
        order.address = 'Jerusalem';
        order.radius = 2;
        order.expected = new Date();
        order = await orderService.createOrder(order);

        order = new Order();
        order.shop = shop;
        order.address = 'Haifa';
        order.radius = 2;
        order.expected = new Date();
        order = await orderService.createOrder(order);
 
        let orders = await orderService.getOrders(new QueryParameters(), shop);
        expect(orders?.length).to.equal(1);
    });
});
