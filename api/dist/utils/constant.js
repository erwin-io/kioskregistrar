"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONST_QUERYCURRENT_TIMESTAMP = exports.CONST_REQUEST_STATUS = exports.CONST_REQUEST_STATUS_ENUM = exports.CONST_USERTYPE = void 0;
exports.CONST_USERTYPE = [
    "ADMIN",
    "MEMBER"
];
exports.CONST_REQUEST_STATUS_ENUM = {
    PENDING: "PENDING",
    TOPAY: "TOPAY",
    PROCESSING: "PROCESSING",
    TOCOMPLETE: "TOCOMPLETE",
    CLOSED: "CLOSED",
};
exports.CONST_REQUEST_STATUS = [
    "PENDING", "TOPAY", "PROCESSING", "TOCOMPLETE", "CLOSED"
];
exports.CONST_QUERYCURRENT_TIMESTAMP = "select (now() AT TIME ZONE 'Asia/Manila'::text) as timestamp";
