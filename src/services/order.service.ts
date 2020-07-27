import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Carrier } from '../models/Carrier';
import { Shop } from '../models/Shop';

import { getConnection } from 'typeorm';
import { QueryParameters, Filter, SortField } from '../typings/QueryParameters';
import _, { create, orderBy, upperFirst } from 'lodash';
import {
    BreakingChangeType,
    GraphQLObjectType,
    GraphQLDirective
} from 'graphql';
import { query } from 'express-validator';
import {
    createFilters,
    createSortFields,
    createPaging,
    createFreeTextSearch
} from '../utils/query-utils';

export const createOrder = async (order: Order) => {
    return getConnection().getRepository(Order).save(order);
};

export async function createOrdersArr(
    orders: Order[],
): Promise<Order[]> {
     return getConnection().getRepository(Order).save(orders);
}

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

export function prepareGetOrdersQuery(
    queryParameters: QueryParameters,
    shop: Shop
) {
    // add shop filter:
    if (shop.name) {
        console.log(queryParameters.filters);
        queryParameters.filters.push({
            fieldName: 'shopId',
            values: [shop.id.toString()]
        });
    }
    const qb = getConnection().getRepository(Order).createQueryBuilder('order');
    createFilters(queryParameters, qb);
    createSortFields(queryParameters, qb);
    createPaging(queryParameters, qb);
    createFreeTextSearch(queryParameters, qb, ['address', 'serviceLevel']); //TODO: create getter method for free-text fields
    console.log(qb.getQueryAndParameters());
    return qb;
}
export function getOrders(
    queryParameters: QueryParameters,
    shop: Shop
): Promise<Order[]> {
    return prepareGetOrdersQuery(queryParameters, shop).getMany();
}
