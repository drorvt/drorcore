import { getConnection, getRepository } from 'typeorm';
import { Carrier } from '../models/Carrier';
import { IOrder } from 'shopify-api-node';

export async function createCarrier(carrier: Carrier): Promise<Carrier> {
    return getConnection().getRepository(Carrier).save(carrier);
}

export async function calculateRecommendedCarrier(
    order: IOrder
): Promise<Carrier> {
    const carrier = await getCarrier('Gett');
    if (carrier) {
        return carrier;
    } else {
        throw new Error('No carrier ' + 'Fedex' + ' found');
    }
}

export async function getCarrier(name: string): Promise<Carrier | undefined> {
    return getConnection()
        .getRepository(Carrier)
        .findOne({ where: { name: name } });
}
