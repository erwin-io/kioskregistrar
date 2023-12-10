import { Repository } from "typeorm";
import { Request } from "src/db/entities/Request";
export declare class DashboardService {
    private readonly requestRepo;
    constructor(requestRepo: Repository<Request>);
    getMemberDashboard(memberId: any): Promise<{
        pending: {
            total: number;
            prio: Request;
        };
        toPay: {
            total: number;
            prio: Request;
        };
        toComplete: {
            total: number;
            prio: Request;
        };
        processing: {
            total: number;
            prio: Request;
        };
    }>;
}
