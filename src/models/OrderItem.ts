import {
    OneToOne,
    Entity,
    Column,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Product } from './Product';
import { Order } from './Order';

@ObjectType()
@Entity()
export class OrderItem {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Product)
    @JoinColumn()
    @Field(type => Product)
    product: Product;

    @OneToOne(type => Order)
    @JoinColumn()
    @Field(type => Order)
    order: Order;

    @Field(type => Int)
    @Column()
    amount:number

}