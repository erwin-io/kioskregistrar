import { Admin } from "./Admin";
import { RequestType } from "./RequestType";
import { Member } from "./Member";
import { SubmittedRequirements } from "./SubmittedRequirements";
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
    rejectReason: string | null;
    cancelReason: string | null;
    assignedAdmin: Admin;
    requestType: RequestType;
    requestedBy: Member;
    submittedRequirements: SubmittedRequirements[];
}
