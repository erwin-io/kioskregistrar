import { Users } from "./Users";
import { Request } from "./Request";
export declare class Admin {
    adminId: string;
    fullName: string;
    mobileNumber: string;
    adminCode: string;
    user: Users;
    requests: Request[];
}
