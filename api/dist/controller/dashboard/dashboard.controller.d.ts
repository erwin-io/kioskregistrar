import { ApiResponseModel } from "src/core/models/api-response.model";
import { DashboardService } from "src/services/dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getMemberDashboard(memberId: string): Promise<ApiResponseModel<any>>;
}
