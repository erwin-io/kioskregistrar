import { Member } from "./Member";
import { Users } from "./Users";
export declare class Files {
    fileId: string;
    fileName: string;
    url: string | null;
    members: Member[];
    users: Users[];
}
