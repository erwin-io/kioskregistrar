import { RequestType } from "./RequestType";
import { SubmittedRequirements } from "./SubmittedRequirements";
export declare class RequestRequirements {
    requestRequirementsId: string;
    name: string;
    requestTypeId: string;
    requireToSubmitProof: boolean;
    active: boolean;
    requestType: RequestType;
    submittedRequirements: SubmittedRequirements[];
}
