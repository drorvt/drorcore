import express, { Request, Response } from "express";
import passport = require("passport");
import { LoggedInUser } from "../models/LoggedInUser";
const LocalStrategy = require("passport-local").Strategy;
import { findUser } from "./user.service";
import { User } from "../models/User";
import { Shop } from "../models/Shop";
const bcrypt = require('bcryptjs');
const uuid = require('uuid').uuidv5;

export const ensureAuthenticated = (req: any, res: Response, next: () => void): void => {
    if (req.originalUrl === '/login' || req.originalUrl === '/login.html') {
        next();
        return;
    }
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/login.html');
    }
};

export const authenticateUser = (req: Request, res: Response, next: () => void): void => {
    let authFunc = passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login.html' });
    authFunc(req, res, next);
};

export const logoffUser = (req: any, res: Response) => {
    delete usersMap['_' + req.user.id];
    req.logout();
    res.redirect('/login.html');
}

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
},
    function (req: any, username: string, password: string, done: any) {
        let hasedPassword: string = bcrypt.hashSync(password, 10);
        findUser(username).then((user) => {
            if (user) {
                bcrypt.compare(password, user.password, (err: any, isMatch: boolean) => {
                    if (isMatch) {
                        let loggedInUser: LoggedInUser = new LoggedInUser(user.email, user.id);
                        if (user.isAdmin) loggedInUser.roles.push("admin");
                        if (user.isWrite) loggedInUser.roles.push("write");

                        usersMap['_' + loggedInUser.id] = loggedInUser;
                        if (req?.body?.store) {
                            if (user?.shops) {
                                let shop: Shop | undefined = user.shops.find(shop => shop.name == req.body.store);
                                if (shop) {
                                    loggedInUser.store = shop.id;
                                    return done(null, loggedInUser);
                                } else {
                                    return done(null, null);
                                }
                            } else {
                                return done(null, null);
                            }
                        } else {    // Login user with no shop in the request. Set default shop if user has 1 shop
                            if (user.shops && user.shops.length == 1){
                                loggedInUser.store = user.shops[0].id;
                            }
                            return done(null, loggedInUser);
                        }
                    } else {    // password hashes don't match
                        return done(null, null);
                    }
                });
            } else {
                return done(null, null);
            }
        });
    }
));

passport.serializeUser(function (user: LoggedInUser, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    let user: LoggedInUser = usersMap['_' + id];
    done(null, user);
});

export const usersMap: any = {};