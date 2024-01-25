/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { JwtPayload } from "../core/interfaces/payload.interface";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";
import * as path from "path";
import {
  compare,
  generateAdminCode,
  generateMemberCode,
  getFullName,
  hash,
} from "src/common/utils/utils";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { RegisterMemberUserDto } from "src/core/dto/auth/register-member.dto";
import moment from "moment";
import { Member } from "src/db/entities/Member";
import { Users } from "src/db/entities/Users";
import { Admin } from "src/db/entities/Admin";
import { LOGIN_ERROR_PASSWORD_INCORRECT, LOGIN_ERROR_PENDING_ACCESS_REQUEST, LOGIN_ERROR_USER_NOT_FOUND } from "src/common/constant/auth-error.constant";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
    private readonly jwtService: JwtService
  ) {}

  async registerMemberBatch(dtos: RegisterMemberUserDto[]) {
    try {
      return await this.userRepo.manager.transaction(
        async (transactionalEntityManager) => {
          const members = [];
          for (var dto of dtos) {
            let user = new Users();
            user.userName = dto.userName;
            user.password = await hash(dto.password);
            user.userType = "MEMBER";
            user.accessGranted = true;
            let member = new Member();
            member.firstName = dto.firstName;
            member.lastName = dto.lastName;
            member.middleName = dto.middleName;
            member.fullName = getFullName(
              dto.firstName,
              dto.middleName,
              dto.lastName
            );
            member.email = dto.email;
            member.mobileNumber = dto.mobileNumber;
            member.birthDate = moment(dto.birthDate.toString()).format("YYYY-MM-DD");
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
            user = await transactionalEntityManager.save(Users, user);
            user.userCode = generateAdminCode(user.userId);
            user = await transactionalEntityManager.save(Users, user);
            member.user = user;
            member = await transactionalEntityManager.save(member);
            member.memberCode = generateMemberCode(member.memberId);
            member = await transactionalEntityManager.save(Member, member);
            delete member.user.password;
            members.push(member);
          }
          return members;
        }
      );
    } catch (ex) {
      throw ex;
    }
  }

  async registerMember(dto: RegisterMemberUserDto) {
    try {
      let user = new Users();
      user.userName = dto.userName;
      user.password = await hash(dto.password);
      user.userType = "MEMBER";
      user.accessGranted = true;
      let member = new Member();
      member.firstName = dto.firstName;
      member.lastName = dto.lastName;
      member.middleName = dto.middleName;
      member.fullName = getFullName(
        dto.firstName,
        dto.middleName,
        dto.lastName
      );
      member.email = dto.email;
      member.mobileNumber = dto.mobileNumber;
      member.birthDate = moment(dto.birthDate.toString()).format("YYYY-MM-DD");
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
      member = await this.userRepo.manager.transaction(
        async (transactionalEntityManager) => {
          user = await transactionalEntityManager.save(Users, user);
          user.userCode = generateAdminCode(user.userId);
          user = await transactionalEntityManager.save(Users, user);
          member.user = user;
          member = await transactionalEntityManager.save(member);
          member.memberCode = generateMemberCode(member.memberId);
          return await transactionalEntityManager.save(Member, member);
        }
      );
      
      return member;
    } catch (ex) {
      throw ex;
    }
  }

  async getByCredentials({userName, password }) {
    try {
      let user = await this.userRepo.findOne({
        where: {
          userName,
          active: true,
        },
      });
      if (!user) {
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(user.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!user.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      delete user.password;

      return user;
    } catch(ex) {
      throw ex;
    }
  }

  async loginAdmin({userName, password}) {
    let login = await this.getByCredentials({userName, password});
    if(!login) {
      throw Error(LOGIN_ERROR_USER_NOT_FOUND)
    }
    const res = await this.adminRepo.findOne({
      where: {
        user: {
          userId: login.userId
        }
      },
      relations: 
      {
        user: {
          profileFile: true
        }
      }
    });
    if(!res) {
      throw Error(LOGIN_ERROR_USER_NOT_FOUND);
    }
    delete res.user.password;
    return res;
  }

  async loginMember({userName, password}) {
    let login = await this.getByCredentials({userName, password});
    if(!login) {
      throw Error(LOGIN_ERROR_USER_NOT_FOUND)
    }
    const res = await this.memberRepo.findOne({ 
      where: {
        user: {
          userId: login.userId
        }
      },
      relations: 
      {
        user: {
          profileFile: true
        }
      }
    });
    if(!res) {
      throw Error(LOGIN_ERROR_USER_NOT_FOUND);
    }
    delete res.user.password;
    return res;
  }
}
