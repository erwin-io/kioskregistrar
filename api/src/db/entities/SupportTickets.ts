import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SupportTicketConvo } from "./SupportTicketConvo";
import { Admin } from "./Admin";
import { Member } from "./Member";

@Index("SupportTickets_pkey", ["supportTicketId"], { unique: true })
@Entity("SupportTickets", { schema: "dbo" })
export class SupportTickets {
  @PrimaryGeneratedColumn({ type: "bigint", name: "SupportTicketId" })
  supportTicketId: string;

  @Column("character varying", { name: "Title" })
  title: string;

  @Column("character varying", { name: "Description" })
  description: string;

  @Column("timestamp with time zone", {
    name: "Date",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  date: Date;

  @Column("character varying", { name: "Status", default: () => "'OPEN'" })
  status: string;

  @OneToMany(
    () => SupportTicketConvo,
    (supportTicketConvo) => supportTicketConvo.supportTicket
  )
  supportTicketConvos: SupportTicketConvo[];

  @ManyToOne(() => Admin, (admin) => admin.supportTickets)
  @JoinColumn([{ name: "AssignedAdminId", referencedColumnName: "adminId" }])
  assignedAdmin: Admin;

  @ManyToOne(() => Member, (member) => member.supportTickets)
  @JoinColumn([
    { name: "RequestedByMemberId", referencedColumnName: "memberId" },
  ])
  requestedByMember: Member;
}
