import { Router, Request, Response, NextFunction, response } from "express";
import axios, { AxiosResponse } from "axios";
import { Users } from "../../src/db/entities/Users";
import { Between, FindOptionsWhere, ILike, In, getManager, getRepository } from "typeorm";
import { CONST_USERTYPE } from "../../src/utils/constant";
import { columnDefToTypeORMCondition, compare, convertColumnNotationToObject, getFullName, hash } from "../../src/utils/utils";
import { CreateAdminUserDto, CreateAdminUserAccessDto, UpdateAdminUserDto, UpdateAdminUserResetPasswordDto, UpdateMemberUserDto } from "../../src/dto/users";
import { Admin } from "../../src/db/entities/Admin";
import { validatorDto } from "../utils/validator";
import { Member } from "../../src/db/entities/Member";
import moment from "moment";
import { format } from 'date-fns';

export const usersRouter = Router();

usersRouter.post(
  "/:type/page",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { type, pageSize, pageIndex, order, columnDef } = { ...req.params, ...req.body } as any;
      const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
      const take = Number(pageSize);
      if(!CONST_USERTYPE.some(x=>x === type.toUpperCase())) {
        throw Error("Invalid type");
      }
      let condition = columnDefToTypeORMCondition(columnDef);
      if(!condition.user || condition.user === undefined) {
        condition.user ={
          userType: type.toUpperCase(),
          active: true,
        }
      } else {
        condition.user.userType = type.toUpperCase();
        condition.user.active = true;
      }
      let [results, total] = await Promise.all([
        getRepository(type.toUpperCase() === "ADMIN" ? Admin : Member).find({
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
      getRepository(type.toUpperCase() === "ADMIN" ? Admin : Member).count({ where: condition}),
    ])
      return res.status(200).json({
        data: {
          results: results,
          total
        },
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.get(
  "/:type/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, type } = req.params;
      if(!CONST_USERTYPE.some(x=>x === type.toUpperCase())) {
        throw Error("Invalid type");
      }
      let result: Admin | Member = await getRepository(type.toUpperCase() === "ADMIN" ? Admin : Member).findOne({
        where:  {
          user: {
            userId: userId,
            active: true,
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
      } else {
        return res.status(404).json({
          message: "Not found!",
        });
      }
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.post(
  "/admin/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateAdminUserDto;
      await validatorDto(CreateAdminUserDto, body);
      let user = new Users();
      user.userName = body.userName;
      user.password = await hash(body.password);
      user.userType = "ADMIN";
      user.access = JSON.parse(JSON.stringify(body.access));
      user.accessGranted = true;
      let admin = new Admin();
      admin.firstName = body.firstName;
      admin.lastName = body.lastName;
      admin.fullName = getFullName(body.firstName, "", body.lastName);
      admin.mobileNumber = body.mobileNumber;
      admin = await getManager().transaction(
        async (transactionalEntityManager) => {
          user = await transactionalEntityManager.save(user);
          admin.user = user;
          return await transactionalEntityManager.save(admin);
        }
      );
      delete admin.user.password;
      return res.status(200).json({
        data: admin,
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.put(
  "/admin/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as UpdateAdminUserDto;
      await validatorDto(UpdateAdminUserDto, body);
      let admin: Admin = await getRepository(Admin).findOne({
        where: {
          user: {
            userId: body.userId,
            userType: "ADMIN",
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
        admin.fullName = getFullName(body.firstName, "", body.lastName);
        admin.mobileNumber = body.mobileNumber;
        let user: Users = admin.user;
        user.access = JSON.parse(JSON.stringify(body.access));
        admin = await getManager().transaction(
          async (transactionalEntityManager) => {
            user = await transactionalEntityManager.save(Users, user);
            return await transactionalEntityManager.save(Admin, admin);
          }
        );
        delete admin.user.password;
        return res.status(200).json({
          message: "user updated successfully",
          data: admin,
          success: true,
        });
      } else {
        return res.status(404).json({
          message: "Not Found!",
        });
      }
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.put(
  "/member/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as UpdateMemberUserDto;
      await validatorDto(UpdateMemberUserDto, body);
      let member: Member = await getRepository(Member).findOne({
        where: {
          user: {
            userId: body.userId,
            userType: "MEMBER",
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
        member.fullName = getFullName(body.firstName, body.middleName, body.lastName);
        member.email = body.email;
        member.mobileNumber = body.mobileNumber;
        member.birthDate = moment(body.birthDate.toString()).format(
          "YYYY-MM-DD"
        );
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
        member = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(Member, member);
          }
        );
        delete member.user.password;
        return res.status(200).json({
          message: "user updated successfully",
          data: member,
          success: true,
        });
      } else {
        return res.status(404).json({
          message: "Not Found!",
        });
      }
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.put(
  "/:userId/resetPassword",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as UpdateAdminUserResetPasswordDto;
      await validatorDto(UpdateAdminUserResetPasswordDto, body);
      let user: Users = await getRepository(Users).findOne({
        where: {
          userId: body.userId,
          active: true,
        },
      });
      if (user) {
        user.password = await hash(body.password);
        user = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(user);
          }
        );
        delete user.password;
        return res.status(200).json({
          message: "user password updated successfully",
          data: user,
          success: true,
        });
      } else {
        return res.status(404).json({
          message: "Not Found!",
        });
      }
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.delete(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params && req.params.userId) {
        let { userId } = req.params;
        let user: Users = await getRepository(Users).findOne({
          where: {
            userId: userId,
            active: true,
          },
        });

        if (user) {
          user.active = false;
          user = await getManager().transaction(
            async (transactionalEntityManager) => {
              return await transactionalEntityManager.save(user);
            }
          );
          delete user.password;
          return res.status(200).json({
            message: "user deleted successfully",
            data: user,
            success: true,
          });
        } else {
          return res.status(404).json({
            message: "Not Found!",
          });
        }
      } else {
        return res.status(400).json({
          message: "Bad request!",
        });
      }
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);
