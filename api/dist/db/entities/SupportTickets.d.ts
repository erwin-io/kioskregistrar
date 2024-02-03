import { SupportTicketConvo } from "./SupportTicketConvo";
import { Admin } from "./Admin";
import { Member } from "./Member";
export declare class SupportTickets {
    supportTicketId: string;
    title: string;
    description: string;
    date: Date;
    status: string;
    supportTicketConvos: SupportTicketConvo[];
    assignedAdmin: Admin;
    requestedByMember: Member;
}
