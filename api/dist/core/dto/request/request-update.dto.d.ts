import { RequestRequirementsDto } from "./request.dto";
export declare class UpdateRequestDto {
    description: string;
    requirements: RequestRequirementsDto[];
}
export declare class UpdateRequestDescriptionDto {
    description: string;
}
export declare class UpdateRequestStatusDto {
}
export declare class AssignRequestDto extends UpdateRequestStatusDto {
    assignedAdminId: string;
}
export declare class MarkRequestAsPaidDto extends UpdateRequestStatusDto {
}
export declare class MarkRequestAsProcessedDto extends UpdateRequestStatusDto {
}
export declare class MarkRequestAsCompletedDto extends UpdateRequestStatusDto {
}
export declare class MarkRequestAsClosedDto extends UpdateRequestStatusDto {
}
export declare class CancelRequestDto extends UpdateRequestStatusDto {
}
export declare class RejectRequestDto extends UpdateRequestStatusDto {
}
