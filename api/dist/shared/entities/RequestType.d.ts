import { Request } from "./Request";
import { RequestRequirements } from "./RequestRequirements";
export declare class RequestType {
    requestTypeId: string;
    name: string;
    authorizeACopy: boolean;
    fee: string;
    isPaymentRequired: boolean;
    active: boolean;
    requests: Request[];
    requestRequirements: RequestRequirements[];
}
