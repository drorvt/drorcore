"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authentication_service_1 = require("./src/services/authentication.service");
var path = require("path");
var passport = require("passport");
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv').config();
console.log(process.env.SHOPIFY_SHOP_NAME);
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true,
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use("/shopify", shopifyRouter);
var user_router_1 = require("./src/routes/user.router");
app.use('/', user_router_1.userRouter);
app.all('/*', authentication_service_1.ensureAuthenticated);
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.use(express.static(path.join(__dirname, '/public')));
app.listen(3000, function () {
    console.log("App is listening on port 3000!");
});
//# sourceMappingURL=app.js.map