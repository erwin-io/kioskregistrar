import { Member } from "./Member";
import { Users } from "./Users";
export declare class Files {
    fileId: string;
    name: string;
    url: string | null;
    guid: string;
    members: Member[];
    users: Users[];
}
