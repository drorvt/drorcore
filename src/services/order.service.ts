import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Carrier } from '../models/Carrier';
import { Shop } from '../models/Shop';

import { getConnection, FindOptionsUtils, FindConditions, In } from 'typeorm';
import {
    QueryParameters,
    SortFields,
    Filters
} from '../typings/QueryParameters';
import _ from 'lodash';

export const createOrder = async (order: Order) => {
    return getConnection().manager.save(order);
};

export const addItemToOrder = async (
    order: Order,
    product: Product,
    quantity: number
) => {
    let orderItem: OrderItem = new OrderItem();
    orderItem.order = order;
    orderItem.product = product;
    orderItem.amount = quantity;
    return (orderItem = await getConnection()
        .getRepository(OrderItem)
        .save(orderItem));
};

export const createCarrier = async (carrier: Carrier): Promise<Carrier> => {
    return getConnection().manager.save(carrier);
};

export const getOrder = (id: number): Promise<Order | undefined> => {
    return getConnection()
        .getRepository(Order)
        .findOne(id, { relations: ['items'] });
};

export function getOrders(
    queryParameters: QueryParameters,
    shop: Shop
): Promise<Order[]> {
    return getConnection().getRepository(Order).find({
        order: queryParameters.sortFields,
        where: queryParameters.filters
    });
    // return getConnection()
    //     .getRepository(Order)
    //     .createQueryBuilder('order')
    //     .where({ shop: shop })
    //     .orderBy(
    //         queryParameters.sortField.fieldName,
    //         queryParameters.sortField.order
    //     )
    //     .where({})
    //     .skip(queryParameters.maxResults * queryParameters.page)
    //     .take(queryParameters.maxResults)
    //     .getMany();
}
