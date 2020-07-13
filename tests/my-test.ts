import { ProductManager } from '../src/services/ProductManager';
import { createUser, addUserToShop } from '../src/services/user.service';
import { User } from '../src/models/User';
import { Shop } from '../src/models/Shop';
import { syncShopify } from '../src/services/shopify.service';

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

export const buildDemoDB = async () => {
    const user: User = new User();
    user.email = 'test@test.com';
    user.isAdmin = true;
    user.password = 'xxx';
    await createUser(user);

    const shop: Shop = new Shop();
    shop.apiKey = 'mykey';
    shop.name = 'demo shop';
    shop.secretKey = 'shhhh';
    shop.url = 'http://google.com';

    addUserToShop(user, shop);
};
