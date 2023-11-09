export const CONST_USERTYPE = [
    "ADMIN",
    "MEMBER"
]


export const CONST_REQUEST_STATUS_ENUM = { 
    PENDING: "PENDING",
    TOPAY: "TOPAY",
    PROCESSING: "PROCESSING",
    TOCOMPLETE: "TOCOMPLETE",
    CLOSED: "CLOSED",
};

export const CONST_REQUEST_STATUS = [
    "PENDING" , "TOPAY" , "PROCESSING" , "TOCOMPLETE" , "CLOSED"
]


export const CONST_QUERYCURRENT_TIMESTAMP = "select (now() AT TIME ZONE 'Asia/Manila'::text) as timestamp";