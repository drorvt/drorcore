import express = require("express");
import {ensureAuthenticated} from "./src/services/authentication.service";
import {createConnection} from "typeorm";
import path = require('path');
import passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
import {logger} from "./src/utils/logger";

require('dotenv').config();
console.log(process.env.SHOPIFY_SHOP_NAME);
import { shopifyRouter } from "./src/routes/shopify.router";

const app: express.Application = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true,
  }));
app.use(passport.initialize());
app.use(passport.session());
// app.use("/shopify", shopifyRouter);
import { userRouter } from "./src/routes/user.router";
app.use('/', userRouter);
app.all('/*', ensureAuthenticated);

app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.use(express.static(path.join(__dirname, '/public')));

createConnection().then((con) => {
    logger.info('info', 'created Database connection');
});

 app.listen(3000, function () {
    logger.info('info', 'App is listening on port 3000!');
});
