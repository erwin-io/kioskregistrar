import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admin } from "./Admin";
import { Member } from "./Member";
import { RequestType } from "./RequestType";

@Index("Request_pkey", ["requestId"], { unique: true })
@Entity("Request", { schema: "dbo" })
export class Request {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RequestId" })
  requestId: string;

  @Column("timestamp with time zone", {
    name: "DateRequested",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateRequested: Date;

  @Column("timestamp with time zone", { name: "DateAssigned", nullable: true })
  dateAssigned: Date | null;

  @Column("timestamp with time zone", { name: "DatePaid", nullable: true })
  datePaid: Date | null;

  @Column("timestamp with time zone", {
    name: "DateProcessStarted",
    nullable: true,
  })
  dateProcessStarted: Date | null;

  @Column("timestamp with time zone", {
    name: "DateProcessEnd",
    nullable: true,
  })
  dateProcessEnd: Date | null;

  @Column("timestamp with time zone", { name: "DateClaimed", nullable: true })
  dateClaimed: Date | null;

  @Column("timestamp with time zone", { name: "DateClosed", nullable: true })
  dateClosed: Date | null;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @Column("character varying", {
    name: "RequestStatus",
    default: () => "'PENDING'",
  })
  requestStatus: string;

  @Column("character varying", { name: "Description" })
  description: string;

  @ManyToOne(() => Admin, (admin) => admin.requests)
  @JoinColumn([{ name: "AssignedAdminId", referencedColumnName: "adminId" }])
  assignedAdmin: Admin;

  @ManyToOne(() => Member, (member) => member.requests)
  @JoinColumn([{ name: "MemberId", referencedColumnName: "memberId" }])
  member: Member;

  @ManyToOne(() => RequestType, (requestType) => requestType.requests)
  @JoinColumn([
    { name: "RequestTypeId", referencedColumnName: "requestTypeId" },
  ])
  requestType: RequestType;
}
