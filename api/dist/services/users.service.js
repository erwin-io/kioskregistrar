"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const utils_1 = require("./../common/utils/utils");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment_1 = __importDefault(require("moment"));
const user_error_constant_1 = require("../common/constant/user-error.constant");
const utils_2 = require("../common/utils/utils");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const Admin_1 = require("../db/entities/Admin");
const Files_1 = require("../db/entities/Files");
const Member_1 = require("../db/entities/Member");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const path_1 = require("path");
let UsersService = class UsersService {
    constructor(firebaseProvoder, userRepo) {
        this.firebaseProvoder = firebaseProvoder;
        this.userRepo = userRepo;
    }
    async getUserPaginationAdmin({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_2.columnDefToTypeORMCondition)(columnDef);
        if (!condition.user || condition.user === undefined) {
            condition.user = {
                active: true,
            };
        }
        else {
            condition.user.active = true;
        }
        const [results, total] = await Promise.all([
            this.userRepo.manager.find(Admin_1.Admin, {
                where: condition,
                relations: {
                    user: {
                        profileFile: true,
                    },
                },
                skip,
                take,
                order,
            }),
            this.userRepo.manager.count(Admin_1.Admin, {
                where: condition,
            }),
        ]);
        return {
            results: results.map((x) => {
                delete x.user.password;
                return x;
            }),
            total,
        };
    }
    async getUserPaginationMember({ pageSize, pageIndex, order, columnDef }, verified) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_2.columnDefToTypeORMCondition)(columnDef);
        if (!condition.user || condition.user === undefined) {
            condition.user = {
                active: true,
            };
        }
        else {
            condition.user.active = true;
        }
        condition.isVerified = verified;
        const [results, total] = await Promise.all([
            this.userRepo.manager.find(Member_1.Member, {
                where: condition,
                relations: {
                    user: {
                        profileFile: true,
                    },
                },
                skip,
                take,
                order,
            }),
            this.userRepo.manager.count(Member_1.Member, {
                where: condition,
            }),
        ]);
        return {
            results: results.map((x) => {
                delete x.user.password;
                return x;
            }),
            total,
        };
    }
    async getUserById(userId) {
        return this.userRepo.findOne({ where: { userId, active: true } });
    }
    async getAdminByCode(adminCode) {
        const res = await this.userRepo.manager.findOne(Admin_1.Admin, {
            where: {
                adminCode,
                user: {
                    active: true,
                },
            },
            relations: {
                user: {
                    profileFile: true,
                },
            },
        });
        if (!res || !(res === null || res === void 0 ? void 0 : res.user)) {
            throw Error(user_error_constant_1.USER_ERROR_ADMIN_NOT_FOUND);
        }
        delete res.user.password;
        res.user.access = res.user.access.map((res) => {
            if (!res.rights) {
                res["rights"] = [];
            }
            return res;
        });
        return res;
    }
    async getMemberByCode(memberCode) {
        const res = await this.userRepo.manager.findOne(Member_1.Member, {
            where: {
                memberCode,
                user: {
                    active: true,
                },
            },
            relations: {
                user: {
                    profileFile: true,
                },
            },
        });
        if (!res || !(res === null || res === void 0 ? void 0 : res.user)) {
            throw Error(user_error_constant_1.USER_ERROR_MEMBER_NOT_FOUND);
        }
        delete res.user.password;
        return res;
    }
    async getAllAdmin() {
        return this.userRepo.manager.find(Admin_1.Admin, {
            where: {
                user: {
                    active: true,
                },
            },
            relations: {
                user: {
                    profileFile: true,
                },
            },
        });
    }
    async createAdmin(dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let user = new Users_1.Users();
            user.userName = dto.userName;
            user.password = await (0, utils_1.hash)(dto.password);
            user.userType = "ADMIN";
            user.access = JSON.parse(JSON.stringify(dto.access));
            user.accessGranted = true;
            let admin = new Admin_1.Admin();
            admin.fullName = dto.fullName;
            admin.mobileNumber = dto.mobileNumber;
            user = await entityManager.save(Users_1.Users, user);
            user.userCode = (0, utils_1.generateAdminCode)(user.userId);
            user = await entityManager.save(Users_1.Users, user);
            admin.user = user;
            admin = await entityManager.save(admin);
            admin.adminCode = (0, utils_1.generateAdminCode)(admin.adminId);
            delete admin.user.password;
            admin = await entityManager.save(Admin_1.Admin, admin);
            admin.user.access = admin.user.access.map((res) => {
                if (!res.rights) {
                    res["rights"] = [];
                }
                return res;
            });
            return admin;
        });
    }
    async updateAdmin(adminCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let admin = await entityManager.findOne(Admin_1.Admin, {
                where: {
                    adminCode,
                    user: {
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
                throw Error(user_error_constant_1.USER_ERROR_ADMIN_NOT_FOUND);
            }
            admin.fullName = dto.fullName;
            admin.mobileNumber = dto.mobileNumber;
            let user = admin.user;
            user.access = JSON.parse(JSON.stringify(dto.access));
            user = await entityManager.save(Users_1.Users, user);
            admin = await entityManager.save(Admin_1.Admin, admin);
            admin = await entityManager.findOne(Admin_1.Admin, {
                where: {
                    adminCode,
                },
                relations: {
                    user: {
                        profileFile: true,
                    },
                },
            });
            delete admin.user.password;
            return admin;
        });
    }
    async updateAdminProfile(adminCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let admin = await entityManager.findOne(Admin_1.Admin, {
                where: {
                    adminCode,
                    user: {
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
                throw Error(user_error_constant_1.USER_ERROR_ADMIN_NOT_FOUND);
            }
            admin.fullName = dto.fullName;
            admin.mobileNumber = dto.mobileNumber;
            let user = admin.user;
            if (dto.profileFile) {
                const newGUID = (0, uuid_1.v4)();
                const bucket = this.firebaseProvoder.app.storage().bucket();
                if (user.profileFile) {
                    try {
                        const deleteFile = bucket.file(`profile/${user.profileFile.name}`);
                        deleteFile.delete();
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                    const file = user.profileFile;
                    file.guid = newGUID;
                    file.name = `${newGUID}${(0, path_1.extname)(dto.profileFile.name)}`;
                    const bucketFile = bucket.file(`profile/${newGUID}${(0, path_1.extname)(dto.profileFile.name)}`);
                    const img = Buffer.from(dto.profileFile.data, "base64");
                    await bucketFile.save(img).then(async (res) => {
                        console.log("res");
                        console.log(res);
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        file.url = url[0];
                        user.profileFile = await entityManager.save(Files_1.Files, file);
                    });
                }
                else {
                    user.profileFile = new Files_1.Files();
                    user.profileFile.guid = newGUID;
                    user.profileFile.name = `${newGUID}${(0, path_1.extname)(dto.profileFile.name)}`;
                    const bucketFile = bucket.file(`profile/${newGUID}${(0, path_1.extname)(dto.profileFile.name)}`);
                    const img = Buffer.from(dto.profileFile.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        user.profileFile.url = url[0];
                        user.profileFile = await entityManager.save(Files_1.Files, user.profileFile);
                    });
                }
            }
            user = await entityManager.save(Users_1.Users, user);
            admin = await entityManager.save(Admin_1.Admin, admin);
            admin = await entityManager.findOne(Admin_1.Admin, {
                where: {
                    adminCode,
                },
                relations: {
                    user: {
                        profileFile: true,
                    },
                },
            });
            delete admin.user.password;
            return admin;
        });
    }
    async updateMember(memberCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let member = await entityManager.findOne(Member_1.Member, {
                where: {
                    memberCode,
                    user: {
                        active: true,
                    },
                },
                relations: {
                    user: {
                        profileFile: true,
                    },
                },
            });
            if (!member) {
                throw Error(user_error_constant_1.USER_ERROR_MEMBER_NOT_FOUND);
            }
            member.fullName = dto.fullName;
            member.email = dto.email;
            member.mobileNumber = dto.mobileNumber;
            member.birthDate = (0, moment_1.default)(dto.birthDate.toString()).format("YYYY-MM-DD");
            member.address = dto.address;
            member.gender = dto.gender;
            member.courseTaken = dto.courseTaken;
            member.major = dto.major;
            member.isAlumni = dto.isAlumni;
            member.schoolYearLastAttended = dto.schoolYearLastAttended;
            member.primarySchoolName = dto.primarySchoolName;
            member.primarySyGraduated = dto.primarySyGraduated;
            member.secondarySchoolName = dto.secondarySchoolName;
            member.secondarySyGraduated = dto.secondarySyGraduated;
            let user = member.user;
            if (dto.profileFile) {
                const newGUID = (0, uuid_1.v4)();
                const bucket = this.firebaseProvoder.app.storage().bucket();
                if (user.profileFile) {
                    try {
                        const deleteFile = bucket.file(`profile/${user.profileFile.guid}${(0, path_1.extname)(user.profileFile.name)}`);
                        const exists = await deleteFile.exists();
                        if (exists[0]) {
                            deleteFile.delete();
                        }
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                    const file = user.profileFile;
                    file.guid = newGUID;
                    file.name = `${dto.profileFile.name}`;
                    const bucketFile = bucket.file(`profile/${newGUID}${(0, path_1.extname)(dto.profileFile.name)}`);
                    const img = Buffer.from(dto.profileFile.data, "base64");
                    await bucketFile.save(img).then(async (res) => {
                        console.log("res");
                        console.log(res);
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        file.url = url[0];
                        user.profileFile = await entityManager.save(Files_1.Files, file);
                    });
                }
                else {
                    user.profileFile = new Files_1.Files();
                    user.profileFile.guid = newGUID;
                    user.profileFile.name = `${dto.profileFile.name}`;
                    const bucketFile = bucket.file(`profile/${newGUID}${(0, path_1.extname)(dto.profileFile.name)}`);
                    const img = Buffer.from(dto.profileFile.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        user.profileFile.url = url[0];
                        user.profileFile = await entityManager.save(Files_1.Files, user.profileFile);
                    });
                }
            }
            user = await entityManager.save(Users_1.Users, user);
            member = await entityManager.save(Member_1.Member, member);
            member = await entityManager.findOne(Member_1.Member, {
                where: {
                    memberCode,
                },
                relations: {
                    user: {
                        profileFile: true,
                    },
                },
            });
            delete member.user.password;
            return member;
        });
    }
    async resetAdminPassword(adminCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let admin = await entityManager.findOne(Admin_1.Admin, {
                where: {
                    adminCode,
                    user: {
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
                throw Error(user_error_constant_1.USER_ERROR_ADMIN_NOT_FOUND);
            }
            const user = admin.user;
            user.password = await (0, utils_1.hash)(dto.password);
            admin = await entityManager.save(Admin_1.Admin, admin);
            delete admin.user.password;
            return admin;
        });
    }
    async resetMemberPassword(memberCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let member = await entityManager.findOne(Member_1.Member, {
                where: {
                    memberCode,
                    user: {
                        active: true,
                    },
                },
                relations: {
                    user: {
                        profileFile: true,
                    },
                },
            });
            if (!member) {
                throw Error(user_error_constant_1.USER_ERROR_MEMBER_NOT_FOUND);
            }
            const user = member.user;
            user.password = await (0, utils_1.hash)(dto.password);
            member = await entityManager.save(Member_1.Member, member);
            delete member.user.password;
            return member;
        });
    }
    async deleteAdmin(adminCode) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            const admin = await entityManager.findOne(Admin_1.Admin, {
                where: {
                    adminCode,
                    user: {
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
                throw Error(user_error_constant_1.USER_ERROR_ADMIN_NOT_FOUND);
            }
            const user = admin.user;
            user.active = false;
            admin.user = await entityManager.save(Users_1.Users, user);
            delete admin.user.password;
            return admin;
        });
    }
    async approveMemberBatch(dto) {
        const success = [];
        const failed = [];
        return await this.userRepo.manager.transaction(async (entityManager) => {
            for (const memberCode of dto.memberCodes) {
                const member = await entityManager.findOne(Member_1.Member, {
                    where: {
                        memberCode,
                        user: {
                            active: true,
                        },
                    },
                    relations: {
                        user: true,
                    },
                });
                if (member) {
                    member.isVerified = true;
                    await entityManager.save(member);
                    success.push(memberCode);
                }
                else {
                    failed.push(memberCode);
                }
            }
            return { success, failed };
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map