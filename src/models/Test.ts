import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity('test')
export class Test {
    @PrimaryColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    city: string;
    
    @Column()
    age: number;
}