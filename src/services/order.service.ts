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
import { getShop } from './shop.service';
import Shopify, { IOrderLineItem, IOrder } from 'shopify-api-node';
import {
    parseShopifyAddress,
    parseShopifyOrderRadius
} from '../utils/geo-utils';
import { calculateDeliveryDateEstimate } from '../utils/date-utils';
import { findProduct } from './products.service';
import { calculateRecommendedCarrier } from './carrier.service';

export const createOrder = async (order: Order) => {
    return getConnection().getRepository(Order).save(order);
};

export async function createOrdersArr(orders: Order[]): Promise<Order[]> {
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

export const getOrder = (id: number): Promise<Order | undefined> => {
    return getConnection()
        .getRepository(Order)
        .findOne(id, { relations: ['items'] });
};

export async function prepareGetOrdersQuery(
    queryParameters: QueryParameters,
    shop: Shop | undefined
) {
    // add shop filter:
    if (!shop) {
        shop = await getShop('demo shop');
    }
    if (shop && shop.name) {
        if (!queryParameters.filters) {
            queryParameters.filters = [];
        }

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
    createFreeTextSearch(queryParameters, qb); //TODO: create getter method for free-text fields
    console.log(qb.getQueryAndParameters());
    return qb;
}
export async function getOrders(
    queryParameters: QueryParameters,
    shop: Shop
): Promise<Order[]> {
    return (await prepareGetOrdersQuery(queryParameters, shop)).getMany();
}

export async function parseShopifyOrder(
    order: Shopify.IOrder,
    shop: Shop
): Promise<Order> {
    const res = new Order();
    res.shop = shop;
    res.address = parseShopifyAddress(order.shipping_address);
    res.radius = parseShopifyOrderRadius(order.shipping_address);
    res.created = new Date(order.created_at);
    res.expected = calculateDeliveryDateEstimate(order);
    res.items = await parseShopifyItems(order.line_items, shop);
    res.recommendedCarrier = await calculateRecommendedCarrier(order);
    res.serviceLevel = parseServiceLevel(order);
    return res;
}
export function parseServiceLevel(order: IOrder): number {
    return 1;
}

export async function parseShopifyOrderItem(
    item: IOrderLineItem,
    shop: Shop
): Promise<OrderItem> {
    //TODO: Handle undefined fields
    const res = new OrderItem();
    if (item.product_id) {
        const product = await findProduct(item.product_id, shop);
        if (product) {
            res.product = product;
        } else {
            throw new Error(
                'No product found for item ' +
                    item.id +
                    '. Product ID: ' +
                    item.product_id
            );
        }
        res.amount = 1;
    }
    //TODO: Does TS wrap this in a promise?
    return res;
}

export async function parseShopifyItems(
    items: IOrderLineItem[],
    shop: Shop
): Promise<OrderItem[]> {
    const res: OrderItem[] = [];
    await Promise.all(
        items.map(async shopifyItem =>
            res.push(await parseShopifyOrderItem(shopifyItem, shop))
        )
    );
    return res;
}
