import { Files } from "./files";

export class Users {
    userId: string;
    userName: string;
    userType: string;
    access: string[];
    accessGranted: boolean;
    active: boolean;
    profileFile: Files;
  }