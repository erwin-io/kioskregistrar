import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Request } from "./Request";

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

  @Column("character varying", { name: "FullName", default: () => "''" })
  fullName: string;

  @Column("character varying", { name: "AdminCode", default: () => "''" })
  adminCode: string;

  @ManyToOne(() => Users, (users) => users.admins)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @OneToMany(() => Request, (request) => request.assignedAdmin)
  requests: Request[];
}
