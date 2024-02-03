import { CreateUserOneSignalSubscriptionDto } from "src/core/dto/user-one-signal-subscription/user-one-signal-subscription.create.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { UserOneSignalSubscription } from "src/db/entities/UserOneSignalSubscription";
import { UserOneSignalSubscriptionService } from "src/services/user-one-signal-subscription.service";
export declare class UserOneSignalSubscriptionController {
    private readonly userOneSignalSubscriptionsService;
    constructor(userOneSignalSubscriptionsService: UserOneSignalSubscriptionService);
    getBySubscriptionId(subscriptionId: string): Promise<ApiResponseModel<UserOneSignalSubscription>>;
    create(userOneSignalSubscriptionsDto: CreateUserOneSignalSubscriptionDto): Promise<ApiResponseModel<UserOneSignalSubscription>>;
}
