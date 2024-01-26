import { Admin } from "./Admin";
import { Member } from "./Member";
import { Notifications } from "./Notifications";
import { Files } from "./Files";
export declare class Users {
    userId: string;
    userName: string;
    password: string;
    userType: string;
    active: boolean;
    accessGranted: boolean;
    access: object;
    userCode: string | null;
    admins: Admin[];
    members: Member[];
    notifications: Notifications[];
    profileFile: Files;
}
