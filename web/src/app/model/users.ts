import { Access } from "./access";
import { Files } from "./files";

export class Users {
    userId: string;
    userName: string;
    userType: string;
    access: Access[];
    accessGranted: boolean;
    active: boolean;
    profileFile: Files;
  }