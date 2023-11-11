import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Request } from "./Request";
import { RequestRequirements } from "./RequestRequirements";

@Index("u_requestType", ["active", "name"], { unique: true })
@Index("RequestType_pkey", ["requestTypeId"], { unique: true })
@Entity("RequestType", { schema: "dbo" })
export class RequestType {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RequestTypeId" })
  requestTypeId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "AuthorizeACopy", default: () => "false" })
  authorizeACopy: boolean;

  @Column("numeric", { name: "Fee", default: () => "0" })
  fee: string;

  @Column("boolean", { name: "IsPaymentRequired", default: () => "false" })
  isPaymentRequired: boolean;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => Request, (request) => request.requestType)
  requests: Request[];

  @OneToMany(
    () => RequestRequirements,
    (requestRequirements) => requestRequirements.requestType
  )
  requestRequirements: RequestRequirements[];
}
