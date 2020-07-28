import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { OrderItem } from './OrderItem';
import { DbAwareColumn } from './DBColumnSupport';
import { Carrier } from './Carrier';
import { Shop } from './Shop';

@ObjectType()
@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    @Field(type => ID)
    id: number;

    @OneToMany(type => OrderItem, orderItem => orderItem.order, { eager: true })
    @JoinColumn()
    @Field(type => [OrderItem])
    items: OrderItem[];

    @Column()
    address: string;

    @Field(type => Shop)
    @JoinColumn()
    @ManyToOne(type => Shop)
    shop: Shop;

    @DbAwareColumn({
        type: 'timestamp',
        name: 'created',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date | null;

    @Field(type => Carrier)
    @JoinColumn()
    @ManyToOne(type => Carrier)
    recommendedCarrier: Carrier;

    @Field(type => Int)
    @Column({ default: () => 0 })
    serviceLevel: number;

    @Field(type => Int)
    @Column({ default: () => 0 })
    radius: number;

    @Field(type => Date)
    @Column()
    expected: Date;

    timePassed(): number {
        return this.created
            ? (this.created?.getTime() - new Date().getTime()) / 1000 / 60
            : 0;
    }
}
