import { User } from '../models/User';
import { Shop } from '../models/Shop';
import { getConnection, getRepository } from 'typeorm';
const bcrypt = require('bcryptjs');

export const createUser = async (user: User) => {
    user.password = bcrypt.hashSync(user.password, 10);
    await getConnection().manager.save(user);
};

export const addUserToShop = async (user: User, shop: Shop) => {
    if (user && shop) {
        if (!user.shops) {
            user.shops = [];
        }
        if (!shop.users) {
            shop.users = [];
        }
        user.shops.push(shop);
        await getConnection().getRepository(User).save(user);
    }
};

export const findUser = async (email: string) => {
    return getRepository(User).findOne({
        where: { email: email },
        relations: ['shops']
    });
};
