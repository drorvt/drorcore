import { User } from '../models/User';
import { getConnection } from 'typeorm';
import { Shop } from '../models/Shop';

export const createShop = async (shop: Shop):Promise<Shop> => {
    return getConnection().manager.save(shop);
};

export const getShop = async (name: string) => {
    return getConnection().getRepository(Shop).findOne({where: { name: name }});
};

export const addShopToUser = async (shop: Shop, user: User) => {
    if (user && shop) {
        user.shops.push(shop);
        shop.users.push(user);
        await getConnection().manager.save([shop, user]);
    }
};

export const getUser = async (userName: string) => {};
