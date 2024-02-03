import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Request } from "./Request";
import { RequestRequirements } from "./RequestRequirements";

@Index("SubmittedRequirements_pkey", ["submittedRequirementId"], {
  unique: true,
})
@Entity("SubmittedRequirements", { schema: "dbo" })
export class SubmittedRequirements {
  @PrimaryGeneratedColumn({ type: "bigint", name: "SubmittedRequirementId" })
  submittedRequirementId: string;

  @Column("json", { name: "Files", default: [] })
  files: object;

  @ManyToOne(() => Request, (request) => request.submittedRequirements)
  @JoinColumn([{ name: "RequestId", referencedColumnName: "requestId" }])
  request: Request;

  @ManyToOne(
    () => RequestRequirements,
    (requestRequirements) => requestRequirements.submittedRequirements
  )
  @JoinColumn([
    {
      name: "RequestRequirementsId",
      referencedColumnName: "requestRequirementsId",
    },
  ])
  requestRequirements: RequestRequirements;
}
