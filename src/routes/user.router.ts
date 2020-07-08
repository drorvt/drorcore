/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import {authenticateUser, logoffUser} from "../services/authentication.service";
export const userRouter = express.Router();


userRouter.post("/user", async (req: Request, res: Response) => {

  });

  userRouter.put("/user", async (req: Request, res: Response) => {

  });


  userRouter.get("/user/:userId", async (req: Request, res: Response) => {

});

userRouter.post('/login', (req, res: Response, next:()=>void) => {
  return authenticateUser(req, res, next);
});

userRouter.get('/logout', function(req:any, res){
  return logoffUser(req, res);
});