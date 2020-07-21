import { createCarrier } from './../src/services/order.service';
const expect = require("chai").expect;
import { initDB, buildDemoDB } from './my-test';
import { createConnection } from 'typeorm';
import { User } from "../src/models/User";
import {createUser, findUser} from '../src/services/user.service';
import * as orderService from '../src/services/order.service';
import * as prodcutService from '../src/services/products.service';
import { assert } from 'chai';
import { Carrier } from '../src/models/Carrier';
import { Order } from '../src/models/Order';
import { Shop } from '../src/models/Shop';
import { OrderItem } from '../src/models/OrderItem';
import { Product } from '../src/models/Product';

let shop:Shop;

describe('Order Creations', function() {

    before(async function () {
        await createConnection({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: ["../src/models/**/*.js", "src/models/*.js"],
            synchronize: true,
            logging: false
        });
        shop = await buildDemoDB();
    });

    it('Creates a Carrier', async () => {
        let carrier:Carrier = new Carrier();
        carrier.name = "Fedex";
        carrier = await createCarrier(carrier);
        expect(carrier?.id).to.be.above(0);
    });

    it('Creates an empty Order', async () => {
        let carrier:Carrier = new Carrier();
        carrier.name = "Fedex";
        carrier = await createCarrier(carrier);

        let order:Order = new Order();
        order.shop = shop;
        order.address = "tel aviv";
        order.radius = 2;
        order.expected = new Date();
        order = await orderService.createOrder(order);
        expect(order?.id).to.be.above(0);
    });

    it('Adds items to an Order', async () => {
        let carrier:Carrier = new Carrier();
        carrier.name = "Fedex";
        carrier = await createCarrier(carrier);

        let order:Order = new Order();
        order.shop = shop;
        order.address = "tel aviv";
        order.radius = 2;
        order.expected = new Date();
        order = await orderService.createOrder(order);
        
        let products:Product[] = await prodcutService.getAllProducts();
        await orderService.addItemToOrder(order, products[0], 5);
        await orderService.addItemToOrder(order, products[0], 4);
        await orderService.addItemToOrder(order, products[1], 8);
        let storedOrder:Order|undefined = await orderService.getOrder(order.id);
        expect(storedOrder?.items.length).to.equal(3);
    });

  });