import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RequestType } from "./RequestType";
import { SubmittedRequirements } from "./SubmittedRequirements";

@Index("u_requestRequirement", ["active", "name", "requestTypeId"], {
  unique: true,
})
@Index("RequestRequirements_pkey", ["requestRequirementsId"], { unique: true })
@Entity("RequestRequirements", { schema: "dbo" })
export class RequestRequirements {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RequestRequirementsId" })
  requestRequirementsId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("bigint", { name: "RequestTypeId" })
  requestTypeId: string;

  @Column("boolean", { name: "RequireToSubmitProof", default: () => "false" })
  requireToSubmitProof: boolean;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(
    () => RequestType,
    (requestType) => requestType.requestRequirements
  )
  @JoinColumn([
    { name: "RequestTypeId", referencedColumnName: "requestTypeId" },
  ])
  requestType: RequestType;

  @OneToMany(
    () => SubmittedRequirements,
    (submittedRequirements) => submittedRequirements.requestRequirements
  )
  submittedRequirements: SubmittedRequirements[];
}
