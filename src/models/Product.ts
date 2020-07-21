import { ProductTag } from './ProductTag';
import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinTable,
    JoinColumn,
    OneToOne,
    ManyToOne
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { DbAwareColumn } from './DBColumnSupport';
import { Shop } from './Shop';

@ObjectType()
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint', unique: true })
    @Field(type => Int)
    shopifyId: number;

    @Field(type => ID)
    @JoinColumn()
    @ManyToOne(type => Shop)
    shop:Shop;

    @Column('varchar')
    @Field(type => String)
    name: string | null;

    @Column({ type: 'varchar', nullable: true })
    @Field(type => String)
    productType: string | null;

    @DbAwareColumn({type: "timestamp",
    name: 'created',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'})
    updated: Date | null;

    @ManyToMany(type => ProductTag, productTag => productTag.products, {
        cascade: true
    })
    @JoinTable()
    productTags: ProductTag[] | null;
}
