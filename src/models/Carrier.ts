import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Order } from './Order';

@ObjectType()
@Entity()
export class Carrier {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => String)
    @Column()
    name: string;

    @OneToMany(type => Order, order => order.recommendedCarrier)
    orders: Order[];
}
