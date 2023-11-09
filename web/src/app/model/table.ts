export class ColumnDefinition {
  name: string;
  label: string;
  apiNotation?: string;
  sticky?: boolean;
  style?: ColumnStyle;
  controls?: boolean;
  format?: {
    type: "currency" | "date" | "date-time" | "number" | "custom";
    custom: string;
  };
  hide?: boolean;
  type?: "string" | "boolean" | "date" | "decimal" = "string";
  filterOptions: ColumnDefinitionFilterOptions;
  urlPropertyName?: string;
  filter: any;
}

export class ColumnDefinitionFilterOptions {
  placeholder?: string;
  enable?: boolean;
  type?: "text" | "option" | "option-yes-no" | "date" | "date-range" | "number";
};
export class ColumnStyle {
  width: string;
  left: string;
}


export class AdminTableColumn {
  adminCode: string;
  fullName: string;
  userName: string;
  mobileNumber: string;
  enable: boolean;
  url?: string;
}

export class MemberTableColumn {
  memberCode: string;
  fullName: string;
  courseTaken: string;
  email: string;
  mobileNumber: string;
  birthDate: string;
  address: string;
  isAlumni: boolean;
  url?: string;
}


export class RequestTypeTableColumn {
  requestTypeId: string;
  name: string;
  authorizeACopy: boolean;
  fee: string;
  isPaymentRequired: boolean;
  active: boolean;
  url?: string;
}

export class RequestTableColumn {
  requestId: string;
  requestNo: string;
  dateRequested: string;
  dateAssigned: string;
  datePaid?: string;
  dateProcessStarted?: string;
  dateProcessEnd?: string;
  dateCompleted?: string;
  dateClosed?: string;
  requestedBy?: string;
  requestType?: string;
  assignedAdminId?: string;
  assignedAdmin?: string;
  url?: string;
}
