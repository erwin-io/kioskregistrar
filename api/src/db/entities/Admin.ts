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
import { SupportTickets } from "./SupportTickets";

@Index("Admin_pkey", ["adminId"], { unique: true })
@Entity("Admin", { schema: "dbo" })
export class Admin {
  @PrimaryGeneratedColumn({ type: "bigint", name: "AdminId" })
  adminId: string;

  @Column("character varying", { name: "FullName" })
  fullName: string;

  @Column("character varying", { name: "MobileNumber" })
  mobileNumber: string;

  @Column("character varying", { name: "AdminCode", default: () => "''" })
  adminCode: string;

  @ManyToOne(() => Users, (users) => users.admins)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @OneToMany(() => Request, (request) => request.assignedAdmin)
  requests: Request[];

  @OneToMany(
    () => SupportTickets,
    (supportTickets) => supportTickets.assignedAdmin
  )
  supportTickets: SupportTickets[];
}
