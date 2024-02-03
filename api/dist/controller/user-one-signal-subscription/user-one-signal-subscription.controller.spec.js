"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_one_signal_subscription_controller_1 = require("./user-one-signal-subscription.controller");
describe("UserOneSignalSubscriptionController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_one_signal_subscription_controller_1.UserOneSignalSubscriptionController],
        }).compile();
        controller = module.get(user_one_signal_subscription_controller_1.UserOneSignalSubscriptionController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=user-one-signal-subscription.controller.spec.js.map