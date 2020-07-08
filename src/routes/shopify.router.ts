/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as ShopifyService from '../services/shopify.service';
import { Product } from "../models/Product";

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
      const products: Product[] = await ShopifyService.findAll();
  
      res.status(200).send(products);
    } catch (e) {
      res.status(404).send(e.message);
    }
  });

  
  
//   // POST items/
  
//   // PUT items/
  
//   // DELETE items/:id
