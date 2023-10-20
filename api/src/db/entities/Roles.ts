import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("u_role", ["active", "name"], { unique: true })
@Index("Roles_pkey", ["roleId"], { unique: true })
@Entity("Roles", { schema: "dbo" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RoleId" })
  roleId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;
}
