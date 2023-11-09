import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("Access_pkey", ["accessId"], { unique: true })
@Index("u_access", ["active", "name"], { unique: true })
@Entity("Access", { schema: "dbo" })
export class Access {
  @PrimaryGeneratedColumn({ type: "bigint", name: "AccessId" })
  accessId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;
}
