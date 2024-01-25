import { ColumnDefinition } from "./table"

export interface AppConfig {
    appName: string;
    reservationConfig: {
      maxCancellation: string;
      daysCancellationLimitReset: string;
      timeSlotHours: {
        start: string;
        end: string;
      };
      timeSlotNotAvailableHours: string[];
      dayOfWeekNotAvailable: string[];
    };
    tableColumns: {
      admin: ColumnDefinition[];
      membersVerified: ColumnDefinition[];
      membersUnVerified: ColumnDefinition[];
      requestType: ColumnDefinition[];
      request: ColumnDefinition[];
    };
    sessionConfig: {
      sessionTimeout: string;
    };
    lookup: {
      access: {
        page: string;
        view: boolean;
        modify: boolean;
        rights: string[];
      }[];
    };
    apiEndPoints: {
      auth: {
        login: {
          admin: string;
          member: string;
        }
        registerMember: string;
      };
      user: {
        getAllAdmin: string;
        getAdminById: string;
        getMemberById: string;
        createAdmin: string;
        updateAdmin: string;
        getAdminByAdvanceSearch: string;
        getMemberByAdvanceSearch: string;
        updateAdminPassword: string;
        changePassword: string;
        toggleGrantAccess: string;
        approveMember: string;
        updateMember: string;
        resetAdminPassword: string;
        resetMemberPassword: string;
      };
      requestType: {
        getByAdvanceSearch: string;
        getById: string;
        create: string;
        update: string;
        delete: string;
      };
      requestRequirements: {
        get: string;
        getById: string;
        create: string;
        update: string;
        delete: string;
      };
      request: {
        getByAdvanceSearch: string;
        create: string;
        updateDescription: string;
        updateStatus: string;
        getById: string;
      };
      notifications: {
        getByAdvanceSearch: string;
        getUnreadByUser: string;
        marAsRead: string;
      };
      dashboard: {
        getMemberDashboard: string;
        getSummaryMemberUsers: string;
      };
      message: { create: string };
    };
  }
