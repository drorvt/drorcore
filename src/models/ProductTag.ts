import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';

@Entity()
export class ProductTag {
    constructor(name: string) {
        this.name = name;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column('string')
    name: string | null;

    @ManyToMany(type => Product, product => product.productTags)
    products: Product[] | null;
}
