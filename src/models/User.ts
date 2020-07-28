import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Shop } from './Shop';
import { DbAwareColumn } from './DBColumnSupport';

@Index('users_FK', ['shopId'], {})
@Entity('users', { schema: 'pdq' })
export class User {
    @Column('varchar', { name: 'password', nullable: true, length: 100 })
    password: string | null;

    @Column('varchar', { name: 'email', nullable: true, length: 100 })
    email: string | null;

    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('int', { name: 'shop_id', nullable: true })
    shopId: number | null;

    @Column('tinyint', { name: 'is_view', nullable: true, width: 1 })
    isView: boolean | null;

    @Column('tinyint', { name: 'is_write', nullable: true, width: 1 })
    isWrite: boolean | null;

    @Column('tinyint', { name: 'is_admin', nullable: true, width: 1 })
    isAdmin: boolean | null;

    // @Column('timestamp', {
    //     name: 'created',
    //     nullable: true,
    //     default: () => 'CURRENT_TIMESTAMP'
    // })
    @DbAwareColumn({
        type: 'timestamp',
        name: 'created',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date | null;

    @ManyToMany(type => Shop, shop => shop.users, { cascade: true })
    @JoinTable()
    shops: Shop[];
}
