import {
  compare,
  generateAdminCode,
  getFullName,
  hash,
} from "./../common/utils/utils";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { type } from "os";
import { skip, take } from "rxjs";
import {
  USER_ERROR_ADMIN_NOT_FOUND,
  USER_ERROR_MEMBER_NOT_FOUND,
} from "src/common/constant/user-error.constant";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import {
  UpdateAdminUserResetPasswordDto,
  UpdateMemberUserResetPasswordDto,
} from "src/core/dto/auth/reset-password.dto";
import {
  MemberVerificationDto,
  UpdateMemberUserDto,
} from "src/core/dto/user/user-member.dto";
import {
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from "src/core/dto/user/users-admin.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Admin } from "src/db/entities/Admin";
import { Member } from "src/db/entities/Member";
import { Users } from "src/db/entities/Users";
import { Repository, getManager } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(Users) private readonly userRepo: Repository<Users>
  ) {}

  async getUserPaginationAdmin({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    const condition = columnDefToTypeORMCondition(columnDef);
    if (!condition.user || condition.user === undefined) {
      condition.user = {
        active: true,
      };
    } else {
      condition.user.active = true;
    }
    const [results, total] = await Promise.all([
      this.userRepo.manager.find(Admin, {
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
      this.userRepo.manager.count(Admin, {
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

  async getUserPaginationMember(
    { pageSize, pageIndex, order, columnDef },
    verified
  ) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    const condition = columnDefToTypeORMCondition(columnDef);
    if (!condition.user || condition.user === undefined) {
      condition.user = {
        active: true,
      };
    } else {
      condition.user.active = true;
    }
    condition.isVerified = verified;
    const [results, total] = await Promise.all([
      this.userRepo.manager.find(Member, {
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
      this.userRepo.manager.count(Member, {
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
    const res = await this.userRepo.manager.findOne(Admin, {
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
    if (!res || !res?.user) {
      throw Error(USER_ERROR_ADMIN_NOT_FOUND);
    }
    delete res.user.password;
    res.user.access = (
      res.user.access as {
        page: string;
        view: boolean;
        modify: boolean;
        rights: string[];
      }[]
    ).map((res) => {
      if (!res.rights) {
        res["rights"] = [];
      }
      return res;
    });
    return res;
  }

  async getMemberByCode(memberCode) {
    const res = await this.userRepo.manager.findOne(Member, {
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
    if (!res || !res?.user) {
      throw Error(USER_ERROR_MEMBER_NOT_FOUND);
    }
    delete res.user.password;
    return res;
  }

  async getAllAdmin() {
    return this.userRepo.manager.find(Admin, {
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

  async createAdmin(dto: CreateAdminUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = new Users();
      user.userName = dto.userName;
      user.password = await hash(dto.password);
      user.userType = "ADMIN";
      user.access = JSON.parse(JSON.stringify(dto.access));
      user.accessGranted = true;
      let admin = new Admin();
      admin.firstName = dto.firstName;
      admin.lastName = dto.lastName;
      admin.fullName = getFullName(dto.firstName, "", dto.lastName);
      admin.mobileNumber = dto.mobileNumber;
      user = await entityManager.save(Users, user);
      user.userCode = generateAdminCode(user.userId);
      user = await entityManager.save(Users, user);
      admin.user = user;
      admin = await entityManager.save(admin);
      admin.adminCode = generateAdminCode(admin.adminId);
      delete admin.user.password;
      admin = await entityManager.save(Admin, admin);
      admin.user.access = (
        admin.user.access as {
          page: string;
          view: boolean;
          modify: boolean;
          rights: string[];
        }[]
      ).map((res) => {
        if (!res.rights) {
          res["rights"] = [];
        }
        return res;
      });
      return admin;
    });
  }

  async updateAdmin(adminCode, dto: UpdateAdminUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let admin = await entityManager.findOne(Admin, {
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
        throw Error(USER_ERROR_ADMIN_NOT_FOUND);
      }

      admin.firstName = dto.firstName;
      admin.lastName = dto.lastName;
      admin.fullName = getFullName(dto.firstName, "", dto.lastName);
      admin.mobileNumber = dto.mobileNumber;
      let user: Users = admin.user;
      user.access = JSON.parse(JSON.stringify(dto.access));
      user = await entityManager.save(Users, user);
      admin = await entityManager.save(Admin, admin);
      admin = await entityManager.findOne(Admin, {
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

  async updateMember(memberCode, dto: UpdateMemberUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let member = await entityManager.findOne(Member, {
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
        throw Error(USER_ERROR_MEMBER_NOT_FOUND);
      }

      member.firstName = dto.firstName;
      member.middleName = dto.middleName;
      member.lastName = dto.lastName;
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

      member = await entityManager.save(Member, member);
      member = await entityManager.findOne(Member, {
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

  async resetAdminPassword(adminCode, dto: UpdateAdminUserResetPasswordDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let admin = await entityManager.findOne(Admin, {
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
        throw Error(USER_ERROR_ADMIN_NOT_FOUND);
      }
      const user: Users = admin.user;
      user.password = await hash(dto.password);
      admin = await entityManager.save(Admin, admin);
      delete admin.user.password;
      return admin;
    });
  }

  async resetMemberPassword(memberCode, dto: UpdateMemberUserResetPasswordDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let member = await entityManager.findOne(Member, {
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
        throw Error(USER_ERROR_MEMBER_NOT_FOUND);
      }
      const user: Users = member.user;
      user.password = await hash(dto.password);
      member = await entityManager.save(Member, member);
      delete member.user.password;
      return member;
    });
  }

  async deleteAdmin(adminCode) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      const admin = await entityManager.findOne(Admin, {
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
        throw Error(USER_ERROR_ADMIN_NOT_FOUND);
      }
      const user: Users = admin.user;
      user.active = false;
      admin.user = await entityManager.save(Users, user);
      delete admin.user.password;
      return admin;
    });
  }

  async approveMemberBatch(dto: MemberVerificationDto) {
    const success = [];
    const failed = [];
    return await this.userRepo.manager.transaction(async (entityManager) => {
      for (const memberCode of dto.memberCodes) {
        const member = await entityManager.findOne(Member, {
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
        } else {
          failed.push(memberCode);
        }
      }
      return { success, failed };
    });
  }
}
