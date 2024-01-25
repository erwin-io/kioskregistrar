import { Repository } from "typeorm";
import { Request } from "src/db/entities/Request";
import { Member } from "src/db/entities/Member";
export declare class DashboardService {
    private readonly requestRepo;
    private readonly memberRepo;
    constructor(requestRepo: Repository<Request>, memberRepo: Repository<Member>);
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
    getSummaryMemberUsers(): Promise<{
        verified: number;
        unVerified: number;
    }>;
}
