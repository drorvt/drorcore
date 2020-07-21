import {
    Column,
    Entity,
    ManyToMany,
    Generated,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Product } from './Product';
import { Shop } from './Shop';
import { Field, ID } from 'type-graphql';

@Entity()
export class ProductTag {
    @Column('int')
    @Generated('uuid')
    uuid: string;

    @PrimaryColumn('varchar')
    name: string | null;

    @ManyToMany(type => Product, product => product.productTags)
    products: Product[] | null;

    @Field(type => ID)
    @JoinColumn()
    @ManyToOne(type => Shop, shop => shop.products)
    shop: Shop;
}
