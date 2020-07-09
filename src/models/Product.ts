import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinTable
} from 'typeorm';
import { ProductTag } from './ProductTag';

@Entity('products', { schema: 'pdq' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    shopId: number | null;

    @Column('varchar')
    name: string | null;

    @Column('varchar')
    productType: string | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updated: Date | null;

    @ManyToMany(type => ProductTag, productTag => productTag.id)
    @JoinTable()
    productTags: ProductTag[] | null;
}
