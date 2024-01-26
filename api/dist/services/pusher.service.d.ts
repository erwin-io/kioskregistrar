import { ConfigService } from "@nestjs/config";
import { Request } from "src/db/entities/Request";
export declare class PusherService {
    private readonly config;
    pusher: any;
    constructor(config: ConfigService);
    trigger(channel: any, event: any, data: any): void;
    reSync(type: string, data: any): Promise<void>;
    requestChanges(userIds: string[], request: Request): Promise<void>;
    sendNotif(userIds: string[], title: string, description: any): Promise<void>;
}
