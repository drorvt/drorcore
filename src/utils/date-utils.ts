import { IOrder } from 'shopify-api-node';

export function calculateDeliveryDateEstimate(order: IOrder): Date {
    return new Date(new Date(order.created_at).getTime() + 1000 * 60 * 60 * 24);
}
