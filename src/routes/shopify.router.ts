/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as ShopifyService from "../services/shopify.service";
import { Product } from "../models/Product";
import { logger } from "../utils/logger";

/**
 * Router Definition
 */
export const shopifyRouter = express.Router();

/**
 * Controller Definitions
 */

// GET items/

shopifyRouter.get("/getAllProducts", async (req: Request, res: Response) => {
  try {
    const products: Product[] = await ShopifyService.getAllProducts();
    res.status(200).send(products);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

//get product by ID:
shopifyRouter.get(
  "/products/:productId",
  async (req: Request, res: Response) => {
    try {
      //+ parses string to number
      const product: Product = await ShopifyService.findProduct(
        +req.params.productId
      );
      res.status(200).send(product);
    } catch (e) {
      res.status(404).send(e.message);
    }
  }
);

shopifyRouter.get("/getAllTags", async (req: Request, res: Response) => {
  try {
    const tags: String[] = await ShopifyService.getAllTags();
    res.status(200).send(tags);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

//get all tags for product
shopifyRouter.get("/tags/:productId", async (req: Request, res: Response) => {
  try {
    const tags: String[] = await ShopifyService.getProductTags(
      +req.params.productId
    );
    res.status(200).send(tags);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

//   // POST items/

//   // PUT items/

//   // DELETE items/:id
