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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("../common/utils/utils");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const moment_1 = __importDefault(require("moment"));
const Member_1 = require("../db/entities/Member");
const Users_1 = require("../db/entities/Users");
const Admin_1 = require("../db/entities/Admin");
const auth_error_constant_1 = require("../common/constant/auth-error.constant");
let AuthService = class AuthService {
    constructor(userRepo, adminRepo, memberRepo, jwtService) {
        this.userRepo = userRepo;
        this.adminRepo = adminRepo;
        this.memberRepo = memberRepo;
        this.jwtService = jwtService;
    }
    async registerMemberBatch(dtos) {
        try {
            return await this.userRepo.manager.transaction(async (transactionalEntityManager) => {
                const members = [];
                for (var dto of dtos) {
                    let user = new Users_1.Users();
                    user.userName = dto.userName;
                    user.password = await (0, utils_1.hash)(dto.password);
                    user.userType = "MEMBER";
                    user.accessGranted = true;
                    let member = new Member_1.Member();
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
                    user = await transactionalEntityManager.save(Users_1.Users, user);
                    user.userCode = (0, utils_1.generateAdminCode)(user.userId);
                    user = await transactionalEntityManager.save(Users_1.Users, user);
                    member.user = user;
                    member = await transactionalEntityManager.save(member);
                    member.memberCode = (0, utils_1.generateMemberCode)(member.memberId);
                    member = await transactionalEntityManager.save(Member_1.Member, member);
                    delete member.user.password;
                    members.push(member);
                }
                return members;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async registerMember(dto) {
        try {
            let user = new Users_1.Users();
            user.userName = dto.userName;
            user.password = await (0, utils_1.hash)(dto.password);
            user.userType = "MEMBER";
            user.accessGranted = true;
            let member = new Member_1.Member();
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
            member = await this.userRepo.manager.transaction(async (transactionalEntityManager) => {
                user = await transactionalEntityManager.save(Users_1.Users, user);
                user.userCode = (0, utils_1.generateAdminCode)(user.userId);
                user = await transactionalEntityManager.save(Users_1.Users, user);
                member.user = user;
                member = await transactionalEntityManager.save(member);
                member.memberCode = (0, utils_1.generateMemberCode)(member.memberId);
                return await transactionalEntityManager.save(Member_1.Member, member);
            });
            return member;
        }
        catch (ex) {
            throw ex;
        }
    }
    async getByCredentials({ userName, password }) {
        try {
            let user = await this.userRepo.findOne({
                where: {
                    userName,
                    active: true,
                },
            });
            if (!user) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(user.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            if (!user.accessGranted) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PENDING_ACCESS_REQUEST);
            }
            delete user.password;
            return user;
        }
        catch (ex) {
            throw ex;
        }
    }
    async loginAdmin({ userName, password }) {
        let login = await this.getByCredentials({ userName, password });
        if (!login) {
            throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
        }
        const res = await this.adminRepo.findOne({
            where: {
                user: {
                    userId: login.userId
                }
            },
            relations: {
                user: {
                    profileFile: true
                }
            }
        });
        if (!res) {
            throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
        }
        delete res.user.password;
        return res;
    }
    async loginMember({ userName, password }) {
        let login = await this.getByCredentials({ userName, password });
        if (!login) {
            throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
        }
        const res = await this.memberRepo.findOne({
            where: {
                user: {
                    userId: login.userId
                }
            },
            relations: {
                user: {
                    profileFile: true
                }
            }
        });
        if (!res) {
            throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
        }
        delete res.user.password;
        return res;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(Admin_1.Admin)),
    __param(2, (0, typeorm_1.InjectRepository)(Member_1.Member)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map