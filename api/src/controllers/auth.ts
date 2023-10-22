/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { Users } from "../../src/db/entities/Users";
import { In, IsNull, getManager, getRepository } from "typeorm";
import { Access } from "../../src/db/entities/Access";
import { Admin } from "../../src/db/entities/Admin";
import { CONST_USERTYPE } from "../../src/utils/constant";
import { compare, hash } from "../../src/utils/utils";
import { LogInUser } from "../../src/dto/auth";
import { CreateMemberUser } from "../../src/dto/users";
import { Member } from "../../src/db/entities/Member";
import moment from 'moment';
import { validatorDto } from "../../src/middleware/validator";

export const authRouter = Router();

authRouter.post(
  "/login/admin",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      await validatorDto(LogInUser, body);
      let admin: Admin = await getRepository(Admin).findOne({
        where: {
          user: {
            userName: body.userName,
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
      if (!admin) {
        return res.status(404).json({
          message: "Not found!",
        });
      }
      const passwordMatch = await compare(admin.user.password, body.password);
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
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

authRouter.post(
  "/login/member",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      await validatorDto(LogInUser, body);
      let member: Member = await getRepository(Member).findOne({
        where: {
          user: {
            userName: body.userName,
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
      if (!member) {
        return res.status(404).json({
          message: "Not found!",
        });
      }
      const passwordMatch = await compare(member.user.password, body.password);
      if (!passwordMatch) {
        return res.status(404).json({
          message: "Not found!",
        });
      }
      delete member.user.password;
      return res.status(200).json({
        data: member,
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

authRouter.post(
  "/register/member",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      await validatorDto(CreateMemberUser, body);
      let user = new Users();
      user.userName = body.userName;
      user.password = await hash(body.password);
      user.userType = "MEMBER";
      user.accessGranted = true;
      let member = new Member();
      member.firstName = body.firstName;
      member.lastName = body.lastName;
      member.email = body.email;
      member.mobileNumber = body.mobileNumber;
      member.birthDate = moment(body.birthDate.toString()).format("YYYY-MM-DD");
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
          user = await transactionalEntityManager.save(user);
          member.user = user;
          return await transactionalEntityManager.save(member);
        }
      );
      delete member.user.password;
      return res.status(200).json({
        data: member,
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);
