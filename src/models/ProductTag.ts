import { Column, Entity, ManyToMany, Generated, PrimaryColumn } from 'typeorm';
import { Product } from './Product';

@Entity()
export class ProductTag {
    @Column('int')
    @Generated('uuid')
    uuid: string;

    @PrimaryColumn('varchar')
    name: string | null;

    @ManyToMany(type => Product, product => product.productTags)
    products: Product[] | null;
}
