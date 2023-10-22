import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("Admin_pkey", ["adminId"], { unique: true })
@Entity("Admin", { schema: "dbo" })
export class Admin {
  @PrimaryGeneratedColumn({ type: "bigint", name: "AdminId" })
  adminId: string;

  @Column("character varying", { name: "FirstName" })
  firstName: string;

  @Column("character varying", { name: "LastName" })
  lastName: string;

  @Column("character varying", { name: "MobileNumber" })
  mobileNumber: string;

  @ManyToOne(() => Users, (users) => users.admins)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
