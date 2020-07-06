import express = require("express");
require('dotenv').config();
console.log(process.env.SHOPIFY_SHOP_NAME);
import { shopifyRouter } from "./src/routes/shopify.router";

const app: express.Application = express();
 
 app.get("/", function (req, res) {
     res.send("Hello World!");
});
app.use("/shopify", shopifyRouter);


 app.listen(3000, function () {
     console.log("App is listening on port 3000!");
});
