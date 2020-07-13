import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    getConnection,
    In,
    getRepository
} from 'typeorm';

@Entity()
export class ProductTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string | null;

    
}
