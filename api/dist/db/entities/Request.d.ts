import { Admin } from "./Admin";
import { RequestType } from "./RequestType";
import { Member } from "./Member";
export declare class Request {
    requestId: string;
    dateRequested: Date;
    dateAssigned: Date | null;
    datePaid: Date | null;
    dateProcessStarted: Date | null;
    dateProcessEnd: Date | null;
    dateCompleted: Date | null;
    dateClosed: Date | null;
    dateLastUpdated: Date | null;
    requestStatus: string;
    description: string;
    requestNo: string;
    isPaid: boolean | null;
    isReAssigned: boolean | null;
    reAssignedAdminId: string | null;
    rAssignedDate: Date | null;
    assignedAdmin: Admin;
    requestType: RequestType;
    requestedBy: Member;
}
