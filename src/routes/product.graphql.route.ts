import { buildSchema,Resolver,Query,Arg } from 'type-graphql';
import { Product } from '../models/Product';
import { getAllProducts,findProduct } from '../services/products.service';
import { GraphQLSchema } from 'graphql';

export const productsSchema = ():Promise<GraphQLSchema> => {
    return buildSchema({
        resolvers: [ProductResolver],
    });
}

@Resolver(Product)
class ProductResolver {    
    @Query(returns => [Product])
    async products() {
        return getAllProducts();
    }

    @Query(returns => Product)
    async product(@Arg("id") id: number) {
        return findProduct(id);
    }
}