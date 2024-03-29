import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Member } from "./Member";
import { Users } from "./Users";

@Index("pk_files_901578250", ["fileId"], { unique: true })
@Entity("Files", { schema: "dbo" })
export class Files {
  @PrimaryGeneratedColumn({ type: "bigint", name: "FileId" })
  fileId: string;

  @Column("text", { name: "Name" })
  name: string;

  @Column("text", { name: "Url", nullable: true })
  url: string | null;

  @Column("text", { name: "GUID" })
  guid: string;

  @OneToMany(() => Member, (member) => member.birthCertFile)
  members: Member[];

  @OneToMany(() => Users, (users) => users.profileFile)
  users: Users[];
}
