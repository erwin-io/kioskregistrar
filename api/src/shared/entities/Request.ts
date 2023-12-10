import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admin } from "./Admin";
import { RequestType } from "./RequestType";
import { Member } from "./Member";

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

  @Column("timestamp with time zone", { name: "DateCompleted", nullable: true })
  dateCompleted: Date | null;

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

  @Column("character varying", { name: "RequestNo", default: () => "''" })
  requestNo: string;

  @Column("boolean", { name: "IsPaid", nullable: true, default: () => "false" })
  isPaid: boolean | null;

  @Column("boolean", {
    name: "IsReAssigned",
    nullable: true,
    default: () => "false",
  })
  isReAssigned: boolean | null;

  @Column("bigint", { name: "ReAssignedAdminId", nullable: true })
  reAssignedAdminId: string | null;

  @Column("timestamp with time zone", { name: "RAssignedDate", nullable: true })
  rAssignedDate: Date | null;

  @Column("character varying", { name: "RejectReason", nullable: true })
  rejectReason: string | null;

  @Column("character varying", { name: "CancelReason", nullable: true })
  cancelReason: string | null;

  @ManyToOne(() => Admin, (admin) => admin.requests)
  @JoinColumn([{ name: "AssignedAdminId", referencedColumnName: "adminId" }])
  assignedAdmin: Admin;

  @ManyToOne(() => RequestType, (requestType) => requestType.requests)
  @JoinColumn([
    { name: "RequestTypeId", referencedColumnName: "requestTypeId" },
  ])
  requestType: RequestType;

  @ManyToOne(() => Member, (member) => member.requests)
  @JoinColumn([{ name: "RequestedById", referencedColumnName: "memberId" }])
  requestedBy: Member;
}
