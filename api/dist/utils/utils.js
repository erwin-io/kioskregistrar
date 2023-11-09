"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMemberCode = exports.generateAdminCode = exports.generateRequestNo = exports.columnDefToTypeORMCondition = exports.getFullName = exports.convertColumnNotationToObject = exports.compare = exports.hash = exports.AESDecrypt = exports.AESEncrypt = exports.round = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const moment_1 = __importDefault(require("moment"));
const round = (number) => {
    return Math.round((number + Number.EPSILON) * 100);
};
exports.round = round;
const AESEncrypt = (value) => __awaiter(void 0, void 0, void 0, function* () {
    // crypto module
    const crypto = require("crypto");
    const algorithm = "aes-256-cbc";
    // generate 16 bytes of data
    const initVector = crypto
        .createHash("sha512")
        .update(fs.readFileSync(path.join(__dirname, "./../../private.key")))
        .digest("hex")
        .substring(0, 16);
    // secret key generate 32 bytes of data
    const Securitykey = crypto
        .createHash("sha512")
        .update(fs.readFileSync(path.join(__dirname, "./../../private.key")))
        .digest("hex")
        .substring(0, 32);
    // the cipher function
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    return Buffer.from(cipher.update(value, "utf8", "hex") + cipher.final("hex")).toString("base64"); // Encrypts data and converts to hex and base64
});
exports.AESEncrypt = AESEncrypt;
const AESDecrypt = (value) => __awaiter(void 0, void 0, void 0, function* () {
    // crypto module
    const crypto = require("crypto");
    const algorithm = "aes-256-cbc";
    // generate 16 bytes of data
    const initVector = crypto
        .createHash("sha512")
        .update(fs.readFileSync(path.join(__dirname, "./../../private.key")))
        .digest("hex")
        .substring(0, 16);
    // secret key generate 32 bytes of data
    const Securitykey = crypto
        .createHash("sha512")
        .update(fs.readFileSync(path.join(__dirname, "./../../private.key")))
        .digest("hex")
        .substring(0, 32);
    const buff = Buffer.from(value, "base64");
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    return (decipher.update(buff.toString("utf8"), "hex", "utf8") +
        decipher.final("utf8")); // Decrypts data and converts to utf8
});
exports.AESDecrypt = AESDecrypt;
const hash = (value) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.hash(value, 10);
});
exports.hash = hash;
const compare = (newValue, hashedValue) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(hashedValue, newValue);
});
exports.compare = compare;
const convertColumnNotationToObject = (notation, nestedValue) => {
    let object = {};
    let pointer = object;
    notation.split('.').map((key, index, arr) => {
        pointer = (pointer[key] = (index == arr.length - 1 ? nestedValue : {}));
    });
    return object;
};
exports.convertColumnNotationToObject = convertColumnNotationToObject;
const getFullName = (firstName, middleName = "", lastName) => {
    if (middleName && middleName !== "") {
        return `${firstName} ${middleName} ${lastName}`;
    }
    else {
        return `${firstName} ${lastName}`;
    }
};
exports.getFullName = getFullName;
const columnDefToTypeORMCondition = (columnDef) => {
    let conditionMapping = [];
    for (var col of columnDef) {
        if (col.type === "date") {
            if ((0, moment_1.default)(new Date(col.filter), "MMM DD, YYYY", true).isValid() || (0, moment_1.default)(new Date(col.filter), "MMMM DD, YYYY", true).isValid() || (0, moment_1.default)(new Date(col.filter), "YYYY-MM-DD", true).isValid()) {
                conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, (0, moment_1.default)(new Date(col.filter), "YYYY-MM-DD")));
            }
        }
        else if (col.type === "date-range") {
            let range = col.filter && col.filter.split(",").length > 0 ? col.filter.split(",").filter(x => x) : [];
            range[1] = range.length === 1 ? range[0] : range[1];
            if ((0, moment_1.default)(new Date(range[0]), "YYYY-MM-DD", true).isValid() && (0, moment_1.default)(new Date(range[1]), "YYYY-MM-DD", true).isValid()) {
                conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, (0, typeorm_1.Between)(range[0], range[1])));
            }
        }
        else if (col.type === "option-yes-no") {
            if (col.filter && col.filter !== "" && (["yes", "no"].some(x => x.toString().toLowerCase() === col.filter.toString().toLowerCase().trim()))) {
                const value = col.filter.toString().toLowerCase().trim() === "yes";
                conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, value));
            }
        }
        else {
            conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, (0, typeorm_1.ILike)(("%" + col.filter + "%"))));
        }
    }
    return Object.assign({}, ...conditionMapping);
};
exports.columnDefToTypeORMCondition = columnDefToTypeORMCondition;
const generateRequestNo = (requestId) => {
    return String(requestId).padStart(6, '0');
};
exports.generateRequestNo = generateRequestNo;
const generateAdminCode = (adminId) => {
    return String(adminId).padStart(6, '0');
};
exports.generateAdminCode = generateAdminCode;
const generateMemberCode = (memberId) => {
    return String(memberId).padStart(6, '0');
};
exports.generateMemberCode = generateMemberCode;
