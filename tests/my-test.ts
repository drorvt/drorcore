import { ProductManager } from '../src/services/ProductManager';
import { createUser, addUserToShop } from '../src/services/user.service';
import { User } from '../src/models/User';
import { Shop } from '../src/models/Shop';
import { Product } from '../src/models/Product';
import { Order } from '../src/models/Order';
import { OrderItem } from '../src/models/OrderItem';
import { Carrier } from '../src/models/Carrier';
import { syncShopify } from '../src/services/shopify.service';
import { saveProduct } from '../src/services/products.service';
import { createShop, getShop } from '../src/services/shop.service';
import { createOrdersArr } from '../src/services/order.service';
import { random } from 'lodash';
import { saveCarrier } from '../src/services/carrier.service';

const fs = require('fs');
const mysql = require('mysql');

console.log('start');

const str: string = fs.readFileSync('ormconfig.json', {
    encoding: 'utf8',
    flag: 'r'
});
const ormconfig: any = JSON.parse(
    fs.readFileSync('ormconfig.json', { encoding: 'utf8', flag: 'r' })
);
const dbName = 'pdqtest';
const pool = mysql.createPool({
    connectionLimit: 5,
    host: ormconfig.host,
    user: ormconfig.username,
    password: ormconfig.password,
    insecureAuth: true
});

const executeQuery = async (sql: string) => {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: any, connection: any) {
            if (err) {
                return reject(err);
            }
            connection.query(sql, function (err: any, rows: any, fields: any) {
                if (!err) {
                    connection.release();
                    return resolve(rows);
                } else {
                    connection.release();
                    return resolve(err);
                }
            });
        });
    });
};

export const initDB = async () => {
    await executeQuery('drop database ' + dbName).catch(err => {
        return Promise.resolve(); // This could fail if DB doesn't exist
    });
    await executeQuery('create database ' + dbName);
};

export async function createDemoOrders(shop: Shop) {
    const ordersArr = [];
    let carrier: Carrier = new Carrier();
    carrier.name = 'Gett';
    carrier = await saveCarrier(carrier);
    for (let i = 0; i < 200; i++) {
        const order: Order = new Order();

        order.recommendedCarrier = carrier;
        order.address = 'Tel Aviv';
        order.shop = shop;
        order.radius = random(0, 100);
        order.created = new Date();
        order.expected = new Date();
        ordersArr.push(order);
    }

    await createOrdersArr(ordersArr);
}

export const buildDemoDB = async (): Promise<Shop> => {
    const user: User = new User();
    user.email = 'test@test.com';
    user.isAdmin = true;
    user.password = 'xxx';
    await createUser(user);

    let shop: Shop | undefined = new Shop();
    shop.apiKey = 'mykey';
    shop.name = 'demo shop';
    shop.secretKey = 'shhhh';
    shop.url = 'http://google.com';
    await addUserToShop(user, shop);

    shop = await getShop(shop.name);
    if (!shop) {
        throw new Error('No shop found for user ' + user);
    }
    await createDemoOrders(shop);

    if (shop) {
        let product = new Product();
        product.name = 'Fish';
        product.shop = shop;
        product.shopifyId = 111;
        product = await saveProduct(product);

        product = new Product();
        product.name = 'Dog';
        product.shop = shop;
        product.shopifyId = 112;
        product = await saveProduct(product);
    }
    return shop;
};
