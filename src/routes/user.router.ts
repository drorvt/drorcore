/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import passport = require('passport');
import {usersMap} from "../services/authentication.service";
const LocalStrategy = require("passport-local").Strategy;
export const userRouter = express.Router();


userRouter.post("/user", async (req: Request, res: Response) => {

  });

  userRouter.put("/user", async (req: Request, res: Response) => {

  });


  userRouter.get("/user/:userId", async (req: Request, res: Response) => {

});

userRouter.post('/login', (req, res: Response, next:()=>void) => {
  let authFunc = passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login.html'});
        authFunc(req, res, next);
    }
);

userRouter.get('/logout', function(req:any, res){
    delete usersMap['_' + req.user.id];
    req.logout();
    res.redirect('/login.html');
});