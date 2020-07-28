import { ICustomerAddress } from 'shopify-api-node';

export function parseShopifyAddress(address: ICustomerAddress): string {
    return (
        address.address1 +
        ' ' +
        address.address2 +
        ' ' +
        address.zip +
        ' ' +
        address.city +
        ' ' +
        address.country_name
    );
}

export function parseShopifyOrderRadius(address: ICustomerAddress): number {
    //TODO: Should determine service radius type (i.e. Center, Periphery, etc.)
    return 1;
}
