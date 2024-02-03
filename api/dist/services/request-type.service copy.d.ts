import { UpdateRequestTypeDto } from "src/core/dto/request-type/request-type-update.dto";
import { RequestTypeDto } from "src/core/dto/request-type/request-type.dto";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { RequestType } from "src/db/entities/RequestType";
import { Repository } from "typeorm";
export declare class RequestTypeService {
    private readonly requestTypeRepo;
    constructor(requestTypeRepo: Repository<RequestType>);
    getRequestTypePagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: RequestType[];
        total: number;
    }>;
    getById(requestTypeId: any): Promise<{
        requestRequirements: RequestRequirements[];
        requestTypeId: string;
        name: string;
        authorizeACopy: boolean;
        fee: string;
        isPaymentRequired: boolean;
        active: boolean;
        requests: import("../db/entities/Request").Request[];
    }>;
    create(dto: RequestTypeDto): Promise<RequestType>;
    update(requestTypeId: any, dto: UpdateRequestTypeDto): Promise<RequestType>;
    delete(requestTypeId: any): Promise<RequestType>;
}
