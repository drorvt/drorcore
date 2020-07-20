import { ProductTag } from './ProductTag';
import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinTable
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint', unique: true })
    @Field(type => Int)
    shopifyId: number;

    @Column('int')
    @Field(type => ID)
    shopId: number | null;

    @Column('varchar')
    @Field(type => String)
    name: string | null;

    @Column({ type: 'varchar', nullable: true })
    @Field(type => String)
    productType: string | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updated: Date | null;

    @ManyToMany(type => ProductTag, productTag => productTag.products, {
        cascade: true
    })
    @JoinTable()
    productTags: ProductTag[] | null;
}
