import { buildSchema,Resolver,Query,Arg } from 'type-graphql';
import { Order } from '../models/Order';
import { getAllProducts,findProduct } from '../services/products.service';
import { GraphQLSchema } from 'graphql';

export const orderSchema = ():Promise<GraphQLSchema> => {
    return buildSchema({
        resolvers: [OrderResolver],
    });
}

@Resolver(Order)
class OrderResolver {    
    @Query(returns => [Order])
    async orders() {
        return getAllProducts();
    }

    @Query(returns => Order)
    async product(@Arg("id") id: number) {
        return findProduct(id);
    }
}