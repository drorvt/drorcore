import { User } from '../models/User';
import { Shop } from '../models/Shop';
import { getConnection, getRepository } from 'typeorm';
import { getShop } from './shop.service';
const bcrypt = require('bcryptjs');

export const createUser = async (user: User) => {
    user.password = bcrypt.hashSync(user.password, 10);
    await getConnection().manager.save(user);
};

export async function addUserToShop(user: User, shop: Shop) {
    if (user && shop) {
        if (!user.shops) {
            user.shops = [];
        }
        if (!shop.users) {
            shop.users = [];
        }
        if (!shop.id && shop.name) {
            const existingShop = await getShop(shop.name);
            if (existingShop) {
                user.shops.push(existingShop);
            } else {
                user.shops.push(shop);
            }
        }
        await getConnection().getRepository(User).save(user);
    }
}

export const findUser = async (email: string) => {
    return getRepository(User).findOne({
        where: { email: email },
        relations: ['shops']
    });
};
