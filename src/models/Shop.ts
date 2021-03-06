import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { User } from './User';
import { DbAwareColumn } from './DBColumnSupport';
import { Product } from './Product';
import { ProductTag } from './ProductTag';

@Entity('shops', { schema: 'pdq' })
export class Shop {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'name', nullable: true, length: 100 })
    name: string | null;

    @Column('varchar', { name: 'url', nullable: true, length: 100 })
    url: string | null;

    @DbAwareColumn({
        type: 'timestamp',
        name: 'created',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    })
    // @Column('timestamp', {
    //     name: 'created',
    //     nullable: true,
    //     default: () => 'CURRENT_TIMESTAMP'
    // })
    created: Date | null;

    @Column('varchar', { name: 'api_key', nullable: true, length: 100 })
    apiKey: string | null;

    @Column('varchar', { name: 'secret_key', nullable: true, length: 100 })
    secretKey: string | null;

    @Column('int', { name: 'owner_id', nullable: true })
    ownerId: number | null;

    @ManyToMany(type => User, user => user.shops)
    users: User[];

    @OneToMany(type => Product, product => product.shop)
    products: Product[];

    @OneToMany(type => ProductTag, productTag => productTag.shop)
    productTags: ProductTag[];
}
