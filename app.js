"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authentication_service_1 = require("./src/services/authentication.service");
var typeorm_1 = require("typeorm");
var path = require("path");
var passport = require("passport");
var bodyParser = require('body-parser');
var session = require('express-session');
var logger_1 = require("./src/utils/logger");
var my_test_1 = require("./tests/my-test");
require('dotenv').config();
console.log(process.env.SHOPIFY_SHOP_NAME);
var production = process.env.PRODOCTION;
console.log('Production: ' + process.env.PRODOCTION);
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
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!production) return [3 /*break*/, 2];
                return [4 /*yield*/, my_test_1.initDB()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, typeorm_1.createConnection().then(function (con) {
                    logger_1.logger.info('info', 'created Database connection');
                })];
            case 3:
                _a.sent();
                return [4 /*yield*/, my_test_1.buildDemoDB()];
            case 4:
                _a.sent();
                app.listen(3000, function () {
                    logger_1.logger.info('info', 'App is listening on port 3000!');
                });
                return [2 /*return*/];
        }
    });
}); };
startServer();
//# sourceMappingURL=app.js.map