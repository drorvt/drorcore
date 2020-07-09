import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('shops', { schema: 'pdq' })
export class Shop {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'name', nullable: true, length: 100 })
    name: string | null;

    @Column('varchar', { name: 'url', nullable: true, length: 100 })
    url: string | null;

    @Column('timestamp', {
        name: 'created',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date | null;

    @Column('varchar', { name: 'api_key', nullable: true, length: 100 })
    apiKey: string | null;

    @Column('varchar', { name: 'secret_key', nullable: true, length: 100 })
    secretKey: string | null;

    @Column('int', { name: 'owner_id', nullable: true })
    ownerId: number | null;

    @ManyToMany(type => User, user => user.shops)
    users: User[];
}
