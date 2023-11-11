import { Users } from "./Users";
import { Request } from "./Request";
export declare class Admin {
    adminId: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    fullName: string;
    adminCode: string;
    user: Users;
    requests: Request[];
}
