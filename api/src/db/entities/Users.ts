import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admin } from "./Admin";
import { Member } from "./Member";
import { Notifications } from "./Notifications";
import { Files } from "./Files";

@Index("u_user", ["active", "userName"], { unique: true })
@Index("pk_users_1557580587", ["userId"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserId" })
  userId: string;

  @Column("character varying", { name: "UserName" })
  userName: string;

  @Column("character varying", { name: "Password" })
  password: string;

  @Column("character varying", { name: "UserType" })
  userType: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("boolean", { name: "AccessGranted", default: () => "false" })
  accessGranted: boolean;

  @Column("json", { name: "Access", default: [] })
  access: object;

  @Column("character varying", { name: "UserCode", nullable: true })
  userCode: string | null;

  @OneToMany(() => Admin, (admin) => admin.user)
  admins: Admin[];

  @OneToMany(() => Member, (member) => member.user)
  members: Member[];

  @OneToMany(() => Notifications, (notifications) => notifications.user)
  notifications: Notifications[];

  @ManyToOne(() => Files, (files) => files.users)
  @JoinColumn([{ name: "ProfileFileId", referencedColumnName: "fileId" }])
  profileFile: Files;
}
