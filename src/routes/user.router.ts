/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import {authenticateUser, logoffUser} from "../services/authentication.service";
import authorize from "../services/authorization.service";
export const userRouter = express.Router();


userRouter.post("/user", async (req: Request, res: Response) => {

  });

  userRouter.put("/user", async (req: Request, res: Response) => {

  });


userRouter.get("/user/:userId", authorize("read"), async (req: Request, res: Response) => {
  res.send("not implemented");
});

userRouter.post('/login', (req, res: Response, next:()=>void) => {
  return authenticateUser(req, res, next);
});

userRouter.get('/logout', function(req:any, res){
  return logoffUser(req, res);
});