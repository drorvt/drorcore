import 'reflect-metadata';
import express = require('express');
require('dotenv').config();
import { ensureAuthenticated } from './src/services/authentication.service';
import { createConnection } from 'typeorm';
import path = require('path');
import passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
import { logger } from './src/utils/logger';
import { initDB, buildDemoDB } from './tests/my-test';

console.log(process.env.SHOPIFY_SHOP_NAME);
const production: any = process.env.PRODOCTION;
console.log('Production: ' + process.env.PRODOCTION);

import { shopifyRouter } from './src/routes/shopify.router';
import { userRouter } from './src/routes/user.router';
import { syncShopify } from './src/services/shopify.service';
import { graphqlHTTP, GraphQLParams } from 'express-graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import { productsSchema } from './src/routes/product.graphql.route';
import { GraphQLSchema } from 'graphql/type/schema';
const { printSchema } = require('graphql');

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'secrettexthere',
        saveUninitialized: true,
        resave: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRouter);
app.use('/shopify', shopifyRouter);

app.all('/*', ensureAuthenticated);

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use(express.static(path.join(__dirname, '/public')));

const startServer = async () => {
    // Initialize test Database
    if (!production) {
        await initDB();
    }

    // app.use(
    //     '/productsql',
    //     graphqlHTTP({
    //         schema: await productsSchema(),
    //         graphiql: true
    //     })
    // );

    app.get('/playground', expressPlayground({ endpoint: '/productsql' }));
    app.listen(4000, () => {
        console.log(
            'Server is running, GraphQL Playground available at http://localhost:4000/playground'
        );
    });

    // .then(con => {
    //     logger.info('info', 'created Database connection');
    // });
    // redundant "then"
    await createConnection();
    logger.info('info', 'created Database connection');

    // await syncShopify();

    await buildDemoDB();

    app.listen(3000, function () {
        logger.info('info', 'App is listening on port 3000!');
    });
};

startServer();
