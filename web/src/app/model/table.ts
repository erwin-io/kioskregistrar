export class ColumnDefinition {
  name: string;
  label: string;
  apiNotation?: string;
  sticky?: boolean;
  style?: ColumnStyle;
  controls?: boolean;
  type?: "string" | "boolean" | "date" | "decimal" = "string";
  filterOptions?: {
    placeholder: string;
    enable: boolean;
    type?: "text" | "option" | "option-yes-no" | "date" | "date-range";
  };
  urlPropertyName?: string;
}

export class ColumnStyle {
  width: string;
  left: string;
}


export class AdminTableColumn {
  userId: string;
  fullName: string;
  userName: string;
  mobileNumber: string;
  enable: boolean;
  url?: string;
}

export class MemberTableColumn {
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
