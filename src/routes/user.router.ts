/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import {authenticateUser, logoffUser} from "../services/authentication.service";
import authorize from "../services/authorization.service";
export const userRouter = express.Router();


userRouter.post("/user", authorize("write"), async (req: Request, res: Response) => {

  });

  userRouter.put("/user", authorize("write"), async (req: Request, res: Response) => {

  });


userRouter.get("/user/:userId", authorize("read"), async (req: Request, res: Response) => {
  res.send("not implemented");
});


userRouter.post('/login', authorize("public"), (req, res: Response, next:()=>void) => {
  return authenticateUser(req, res, next);
});


userRouter.get('/logout', authorize("read","write"), function(req:any, res){
  return logoffUser(req, res);
});