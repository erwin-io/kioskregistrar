export declare class RequestRequirementsFileDto {
    name: string;
    data: any;
}
export declare class RequestRequirementsDto {
    requestRequirementsId: string;
    files: RequestRequirementsFileDto[];
}
export declare class RequestDto {
    requestedById: string;
    requestTypeId: string;
    description: string;
    requirements: RequestRequirementsDto[];
}
