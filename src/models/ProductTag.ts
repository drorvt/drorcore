import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string | null;
}
