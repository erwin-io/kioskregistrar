export declare class RequestTypeDto {
    name: string;
    authorizeACopy: boolean;
    fee: string;
    isPaymentRequired: boolean;
}
export declare class RequestRequirementDto {
    name: string;
    requireToSubmitProof: boolean;
}
export declare class CreateRequestRequirementDto extends RequestRequirementDto {
    requestTypeId: string;
}
