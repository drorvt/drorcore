import {
    OneToOne,
    Entity,
    Column,
    JoinColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
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

    @ManyToOne(type => Product)
    @Field(type => Product)
    product: Product;

    @ManyToOne(type => Order)
    @Field(type => Order)
    order: Order;

    @Field(type => Int)
    @Column()
    amount:number

}