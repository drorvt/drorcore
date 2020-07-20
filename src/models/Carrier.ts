import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
@Entity()
export class Carrier {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => String)
    @Column()
    name: string;
}