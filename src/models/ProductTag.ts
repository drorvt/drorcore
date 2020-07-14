import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Product } from './Product';

@Entity()
export class ProductTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string | null;

    @ManyToMany(type => Product, product => product.productTags)
    products: Product[] | null;
}
