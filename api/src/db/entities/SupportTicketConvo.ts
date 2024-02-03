import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { SupportTickets } from "./SupportTickets";

@Index("SupportTicketConvo_pkey", ["supportTicketConvoId"], { unique: true })
@Entity("SupportTicketConvo", { schema: "dbo" })
export class SupportTicketConvo {
  @PrimaryGeneratedColumn({ type: "bigint", name: "SupportTicketConvoId" })
  supportTicketConvoId: string;

  @Column("character varying", { name: "Message" })
  message: string;

  @Column("timestamp with time zone", {
    name: "Date",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  date: Date;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("boolean", { name: "Read", default: () => "false" })
  read: boolean;

  @ManyToOne(() => Users, (users) => users.supportTicketConvos)
  @JoinColumn([{ name: "FromUserId", referencedColumnName: "userId" }])
  fromUser: Users;

  @ManyToOne(
    () => SupportTickets,
    (supportTickets) => supportTickets.supportTicketConvos
  )
  @JoinColumn([
    { name: "SupportTicketId", referencedColumnName: "supportTicketId" },
  ])
  supportTicket: SupportTickets;
}
