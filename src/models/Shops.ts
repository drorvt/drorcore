import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";

@Entity("shops", { schema: "pdq" })
export class Shops {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("varchar", { name: "url", nullable: true, length: 100 })
  url: string | null;

  @Column("timestamp", {
    name: "created",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  created: Date | null;

  @Column("varchar", { name: "api_key", nullable: true, length: 100 })
  apiKey: string | null;

  @Column("varchar", { name: "secret_key", nullable: true, length: 100 })
  secretKey: string | null;

  @Column("int", { name: "owner_id", nullable: true })
  ownerId: number | null;

  @OneToMany(() => Users, (users) => users.shop)
  users: Users[];
}
