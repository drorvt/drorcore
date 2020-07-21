import { buildSchema, Resolver, Query, Arg } from 'type-graphql';
import { Order } from '../models/Order';
import { getAllProducts, findProduct } from '../services/products.service';
import { GraphQLSchema } from 'graphql';
import { Shop } from '../models/Shop';

export const orderSchema = (): Promise<GraphQLSchema> => {
    return buildSchema({
        resolvers: [OrderResolver]
    });
};

@Resolver(Order)
class OrderResolver {
    @Query(returns => [Order])
    async orders(@Arg('shop') shop: Shop) {
        return getAllProducts(shop);
    }

    @Query(returns => Order)
    async product(@Arg('id') id: number, @Arg('shop') shop: Shop) {
        return findProduct(id, shop);
    }
}
