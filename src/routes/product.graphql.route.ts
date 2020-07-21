import { buildSchema, Resolver, Query, Arg } from 'type-graphql';
import { Product } from '../models/Product';
import { getAllProducts, findProduct } from '../services/products.service';
import { GraphQLSchema } from 'graphql';
import { Shop } from '../models/Shop';

export const productsSchema = (): Promise<GraphQLSchema> => {
    return buildSchema({
        resolvers: [ProductResolver]
    });
};

@Resolver(Product)
class ProductResolver {
    @Query(returns => [Product])
    async products(@Arg('shop') shop: Shop) {
        return getAllProducts(shop);
    }

    @Query(returns => Product)
    async product(@Arg('id') id: number, @Arg('shop') shop: Shop) {
        return findProduct(id, shop);
    }
}
