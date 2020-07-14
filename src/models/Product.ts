import { ProductTag } from './ProductTag';
import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinTable
} from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint', unique: true })
    shopifyId: number;

    @Column('int')
    shopId: number | null;

    @Column('varchar')
    name: string | null;

    @Column('varchar')
    productType: string | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updated: Date | null;

    @ManyToMany(type => ProductTag, productTag => productTag.products)
    @JoinTable()
    productTags: ProductTag[] | null;
}
