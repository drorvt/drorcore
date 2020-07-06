import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Shops } from "./Shops";

@Index("users_FK", ["shopId"], {})
@Entity("users", { schema: "pdq" })
export class Users {
  @Column("varchar", { name: "user_name", nullable: true, length: 100 })
  userName: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 100 })
  password: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "shop_id", nullable: true })
  shopId: number | null;

  @Column("tinyint", { name: "is_view", nullable: true, width: 1 })
  isView: boolean | null;

  @Column("tinyint", { name: "is_write", nullable: true, width: 1 })
  isWrite: boolean | null;

  @Column("tinyint", { name: "is_admin", nullable: true, width: 1 })
  isAdmin: boolean | null;

  @Column("timestamp", {
    name: "created",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  created: Date | null;

  @ManyToOne(() => Shops, (shops) => shops.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "shop_id", referencedColumnName: "id" }])
  shop: Shops;
}
