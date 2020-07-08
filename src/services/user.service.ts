import { User } from "../models/User";
import { Shop } from "../models/Shop";

import {getConnection} from "typeorm";

export const createUser = async (user:User) => {
    await getConnection().manager.save(user);
};

export const addUserToShop = async (user:User, shop:Shop) => {
    if (user && shop){
        if (!user.shops){
            user.shops = [];
        }
        if (!shop.users){
            shop.users = [];
        }
        user.shops.push(shop);
        // shop.users.push(user);
        await getConnection().manager.save([shop,user]);
    }
};


export const getUser = async (userName:string) => {
    
};