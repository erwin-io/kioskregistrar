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
exports.usersRouter = void 0;
const express_1 = require("express");
const Users_1 = require("../db/entities/Users");
const typeorm_1 = require("typeorm");
const constant_1 = require("../utils/constant");
const utils_1 = require("../utils/utils");
const users_1 = require("../dto/users");
const Admin_1 = require("../db/entities/Admin");
const validator_1 = require("../utils/validator");
const Member_1 = require("../db/entities/Member");
const moment_1 = __importDefault(require("moment"));
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.post("/:type/page", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { type, pageSize, pageIndex, order, columnDef, verified } = Object.assign(Object.assign({}, req.params), req.body);
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        if (!constant_1.CONST_USERTYPE.some(x => x === type.toUpperCase())) {
            throw Error("Invalid type");
        }
        let condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        if (!condition.user || condition.user === undefined) {
            condition.user = {
                userType: type.toUpperCase(),
                active: true,
            };
        }
        else {
            condition.user.userType = type.toUpperCase();
            condition.user.active = true;
        }
        if (verified === undefined || verified === null) {
            verified = false;
        }
        if (type.toUpperCase() === "MEMBER") {
            condition.isVerified = verified;
        }
        let [results, total] = yield Promise.all([
            (0, typeorm_1.getRepository)(type.toUpperCase() === "ADMIN" ? Admin_1.Admin : Member_1.Member).find({
                select: {
                    user: {
                        userId: true,
                        userName: true,
                        userType: true,
                        active: true,
                        accessGranted: true,
                        profileFile: {
                            fileId: true,
                            fileName: true,
                            url: true
                        }
                    },
                },
                where: condition,
                relations: {
                    user: true
                },
                skip,
                take,
                order
            }),
            (0, typeorm_1.getRepository)(type.toUpperCase() === "ADMIN" ? Admin_1.Admin : Member_1.Member).count({ where: condition }),
        ]);
        return res.status(200).json({
            data: {
                results: results,
                total
            },
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.get("/admin/:adminCode/details", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminCode } = req.params;
        let result = yield (0, typeorm_1.getRepository)(Admin_1.Admin).findOne({
            where: {
                adminCode,
                user: {
                    active: true
                }
            },
            relations: {
                user: true
            }
        });
        if (result) {
            delete result.user.password;
            return res.status(200).json({
                data: result,
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.get("/member/:memberCode/details", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { memberCode } = req.params;
        let result = yield (0, typeorm_1.getRepository)(Member_1.Member).findOne({
            where: {
                memberCode,
                user: {
                    active: true
                }
            },
            relations: {
                user: true
            }
        });
        if (result) {
            delete result.user.password;
            return res.status(200).json({
                data: result,
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.get("/admin/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, typeorm_1.getRepository)(Admin_1.Admin).find({
            where: {
                user: {
                    active: true,
                }
            }
        });
        if (result) {
            return res.status(200).json({
                data: result.map(x => x),
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.post("/admin/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield (0, validator_1.validatorDto)(users_1.CreateAdminUserDto, body);
        let user = new Users_1.Users();
        user.userName = body.userName;
        user.password = yield (0, utils_1.hash)(body.password);
        user.userType = "ADMIN";
        user.access = JSON.parse(JSON.stringify(body.access));
        user.accessGranted = true;
        let admin = new Admin_1.Admin();
        admin.firstName = body.firstName;
        admin.lastName = body.lastName;
        admin.fullName = (0, utils_1.getFullName)(body.firstName, "", body.lastName);
        admin.mobileNumber = body.mobileNumber;
        admin = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            user = yield transactionalEntityManager.save(user);
            admin.user = user;
            admin = yield transactionalEntityManager.save(admin);
            admin.adminCode = (0, utils_1.generateAdminCode)(admin.adminId);
            return yield transactionalEntityManager.save(Admin_1.Admin, admin);
        }));
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
exports.usersRouter.put("/admin/:adminCode", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(users_1.UpdateAdminUserDto, body);
        let admin = yield (0, typeorm_1.getRepository)(Admin_1.Admin).findOne({
            where: {
                adminCode: body.adminCode,
                user: {
                    active: true,
                },
            },
            relations: {
                user: {
                    profileFile: true
                },
            }
        });
        if (admin) {
            admin.firstName = body.firstName;
            admin.lastName = body.lastName;
            admin.fullName = (0, utils_1.getFullName)(body.firstName, "", body.lastName);
            admin.mobileNumber = body.mobileNumber;
            let user = admin.user;
            user.access = JSON.parse(JSON.stringify(body.access));
            admin = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                user = yield transactionalEntityManager.save(Users_1.Users, user);
                return yield transactionalEntityManager.save(Admin_1.Admin, admin);
            }));
            delete admin.user.password;
            return res.status(200).json({
                message: "user updated successfully",
                data: admin,
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not Found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.put("/member/:memberCode", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(users_1.UpdateMemberUserDto, body);
        let member = yield (0, typeorm_1.getRepository)(Member_1.Member).findOne({
            where: {
                memberCode: body.memberCode,
                user: {
                    active: true,
                },
            },
            relations: {
                user: {
                    profileFile: true
                },
            }
        });
        if (member) {
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
            member = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                return yield transactionalEntityManager.save(Member_1.Member, member);
            }));
            delete member.user.password;
            return res.status(200).json({
                message: "user updated successfully",
                data: member,
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not Found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.put("/admin/:adminCode/resetPassword", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(users_1.UpdateAdminUserResetPasswordDto, body);
        let admin = yield (0, typeorm_1.getRepository)(Admin_1.Admin).findOne({
            where: {
                adminCode: body.adminCode,
                user: {
                    active: true,
                }
            },
            relations: {
                user: true
            }
        });
        if (admin && admin.user) {
            let user = admin.user;
            user.password = yield (0, utils_1.hash)(body.password);
            user = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                return yield transactionalEntityManager.save(Users_1.Users, user);
            }));
            delete user.password;
            admin.user = user;
            return res.status(200).json({
                message: "user password updated successfully",
                data: admin,
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not Found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.put("/member/:memberCode/resetPassword", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(users_1.UpdateMemberUserResetPasswordDto, body);
        let member = yield (0, typeorm_1.getRepository)(Member_1.Member).findOne({
            where: {
                memberCode: body.memberCode,
                user: {
                    active: true,
                }
            },
            relations: {
                user: true
            }
        });
        if (member && member.user) {
            let user = member.user;
            user.password = yield (0, utils_1.hash)(body.password);
            user = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                return yield transactionalEntityManager.save(Users_1.Users, user);
            }));
            delete user.password;
            member.user = user;
            return res.status(200).json({
                message: "user password updated successfully",
                data: member,
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not Found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.delete("/admin/:adminCode", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params && req.params.adminCode) {
            let { adminCode } = req.params;
            let admin = yield (0, typeorm_1.getRepository)(Admin_1.Admin).findOne({
                where: {
                    adminCode,
                    user: {
                        active: true,
                    }
                },
                relations: {
                    user: true
                }
            });
            if (admin && admin.user) {
                let user = admin.user;
                user.active = false;
                user = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield transactionalEntityManager.save(Users_1.Users, user);
                }));
                delete user.password;
                admin.user = user;
                return res.status(200).json({
                    message: "user deleted successfully",
                    data: admin,
                    success: true,
                });
            }
            else {
                return res.status(404).json({
                    message: "Not Found!",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Bad request!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.usersRouter.post("/member/approve/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield (0, validator_1.validatorDto)(users_1.MemberVerificationDto, body);
        let success = [];
        let failed = [];
        if (body.memberCodes && body.memberCodes.length > 0) {
            yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                for (var memberCode of body.memberCodes) {
                    let member = yield (0, typeorm_1.getRepository)(Member_1.Member).findOne({
                        where: {
                            memberCode,
                            user: {
                                active: true
                            }
                        },
                        relations: {
                            user: true
                        }
                    });
                    if (member) {
                        member.isVerified = true;
                        yield transactionalEntityManager.save(member);
                        success.push(memberCode);
                    }
                    else {
                        failed.push(memberCode);
                    }
                }
            }));
            return res.status(200).json({
                message: "Member verification successfully completed",
                data: { success, failed },
                success: true,
            });
        }
        else {
            return res.status(200).json({
                message: "Bad request!",
                success: false,
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
