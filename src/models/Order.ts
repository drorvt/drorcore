import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { OrderItem } from './OrderItem';
import { DbAwareColumn } from './DBColumnSupport';
import { Carrier } from './Carrier';

@ObjectType()
@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    @Field(type => ID)
    id: number;

    @OneToMany(type => OrderItem, inverseSide => true)
    items: OrderItem[];

    @Column()
    address: string;

    @DbAwareColumn({type: "timestamp",
    name: 'created',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'})
    created: Date | null;

    timePassed(): string{
        return "";
    }

    @Field(type => Carrier)
    @JoinColumn()
    @OneToOne(type => Carrier)
    recommendedCarrier: Carrier;

    @Field(type => Int)
    @Column( {default: () => 0})
    serviceLevel: number;

    @Field(type => Int)
    @Column( {default: () => 0})
    radius: number;

    @Field(type => Date)
    @Column()
    expected: Date;
}