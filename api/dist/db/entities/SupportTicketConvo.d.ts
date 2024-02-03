import { Users } from "./Users";
import { SupportTickets } from "./SupportTickets";
export declare class SupportTicketConvo {
    supportTicketConvoId: string;
    message: string;
    date: Date;
    active: boolean;
    read: boolean;
    fromUser: Users;
    supportTicket: SupportTickets;
}
