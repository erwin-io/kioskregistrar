"use strict";
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
exports.authRouter = void 0;
/** source/controllers/posts.ts */
const express_1 = require("express");
const Users_1 = require("../../src/db/entities/Users");
const typeorm_1 = require("typeorm");
const Admin_1 = require("../../src/db/entities/Admin");
const utils_1 = require("../../src/utils/utils");
const auth_1 = require("../../src/dto/auth");
const users_1 = require("../../src/dto/users");
const Member_1 = require("../../src/db/entities/Member");
const moment_1 = __importDefault(require("moment"));
const validator_1 = require("../utils/validator");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login/:type", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        if (!type || type === "") {
            return res.status(404).json({
                message: "Bad request, Invalid type!",
            });
        }
        const body = req.body;
        yield (0, validator_1.validatorDto)(auth_1.LogInUser, body);
        let admin = yield (0, typeorm_1.getRepository)(type === "admin" ? Admin_1.Admin : Member_1.Member).findOne({
            where: {
                user: {
                    userName: body.userName,
                    userType: type.trim().toUpperCase(),
                    active: true,
                },
            },
            relations: {
                user: {
                    profileFile: true,
                },
            },
        });
        if (!admin) {
            return res.status(404).json({
                message: "Not found!",
            });
        }
        const passwordMatch = yield (0, utils_1.compare)(admin.user.password, body.password);
        if (!passwordMatch) {
            return res.status(404).json({
                message: "Not found!",
            });
        }
        if (!admin.user.accessGranted) {
            return res.status(404).json({
                message: "Pending access request!",
            });
        }
        delete admin.user.password;
        return res.status(200).json({
            data: admin,
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.authRouter.post("/register/member", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield (0, validator_1.validatorDto)(users_1.CreateMemberUserDto, body);
        let user = new Users_1.Users();
        user.userName = body.userName;
        user.password = yield (0, utils_1.hash)(body.password);
        user.userType = "MEMBER";
        user.accessGranted = true;
        let member = new Member_1.Member();
        member.firstName = body.firstName;
        member.lastName = body.lastName;
        member.middleName = body.middleName;
        member.fullName = (0, utils_1.getFullName)(body.firstName, body.middleName, body.lastName);
        member.email = body.email;
        member.mobileNumber = body.mobileNumber;
        member.birthDate = (0, moment_1.default)(body.birthDate.toString()).format("YYYY-MM-DD");
        member.address = body.address;
        member.gender = body.gender;
        member.courseTaken = body.courseTaken;
        member.major = body.major;
        member.isAlumni = body.isAlumni;
        member.schoolYearLastAttended = body.schoolYearLastAttended;
        member.primarySchoolName = body.primarySchoolName;
        member.primarySyGraduated = body.primarySyGraduated;
        member.secondarySchoolName = body.secondarySchoolName;
        member.secondarySyGraduated = body.secondarySyGraduated;
        member = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            user = yield transactionalEntityManager.save(user);
            member.user = user;
            member = yield transactionalEntityManager.save(member);
            member.memberCode = (0, utils_1.generateMemberCode)(member.memberId);
            return yield transactionalEntityManager.save(Member_1.Member, member);
        }));
        delete member.user.password;
        return res.status(200).json({
            data: member,
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.authRouter.post("/register/member/batch", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bodys = req.body;
        let result = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const members = [];
            for (var body of bodys) {
                yield (0, validator_1.validatorDto)(users_1.CreateMemberUserDto, body);
                let user = new Users_1.Users();
                user.userName = body.userName;
                user.password = yield (0, utils_1.hash)(body.password.toString());
                user.userType = "MEMBER";
                user.accessGranted = true;
                let member = new Member_1.Member();
                member.firstName = body.firstName;
                member.middleName = body.middleName;
                member.lastName = body.lastName;
                member.fullName = (0, utils_1.getFullName)(body.firstName, body.middleName, body.lastName);
                member.email = body.email;
                member.mobileNumber = body.mobileNumber;
                member.birthDate = (0, moment_1.default)(body.birthDate.toString()).format("YYYY-MM-DD");
                member.address = body.address;
                member.gender = body.gender;
                member.courseTaken = body.courseTaken;
                member.major = body.major;
                member.isAlumni = body.isAlumni;
                member.schoolYearLastAttended = body.schoolYearLastAttended;
                member.primarySchoolName = body.primarySchoolName;
                member.primarySyGraduated = body.primarySyGraduated;
                member.secondarySchoolName = body.secondarySchoolName;
                member.secondarySyGraduated = body.secondarySyGraduated;
                user = yield transactionalEntityManager.save(user);
                member.user = user;
                member = yield transactionalEntityManager.save(member);
                member.memberCode = (0, utils_1.generateMemberCode)(member.memberId);
                member = yield transactionalEntityManager.save(Member_1.Member, member);
                delete member.user.password;
                members.push(member);
            }
            return members;
        }));
        return res.status(200).json({
            data: result,
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
