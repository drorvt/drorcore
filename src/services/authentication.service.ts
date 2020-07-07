import express, { Request, Response } from "express";
import passport = require("passport");
import { LoggedInUser } from "../models/LoggedInUser";
const LocalStrategy = require("passport-local").Strategy;


export const ensureAuthenticated = (req:any, res:Response, next:() => void): void => {
    if (req.originalUrl === '/login' || req.originalUrl === '/login.html') {
        next();
        return;
    }    
    if(req.isAuthenticated()){
        return next();
    }else{        
        return res.redirect('/login.html');
    }
};

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  },
  function(req:any, username:string, password:string, done:any) {
        if (username === 'admin' && password === 'admin'){
            let user:LoggedInUser = new LoggedInUser('admin', 123);
            usersMap['_' + user.id] = user;
            return done(null, user);
        }
  }
  ));
  
  passport.serializeUser(function(user:LoggedInUser, done){
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done){
    let user:LoggedInUser = usersMap['_'+id];
    done(null, user);  
  });

export const usersMap:any = {};