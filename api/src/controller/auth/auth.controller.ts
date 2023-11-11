import { LocalAuthGuard } from "../../core/auth/local.auth.guard";
import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Headers,
  Query,
} from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import {
  RegisterMemberBatchUserDto,
  RegisterMemberUserDto,
} from "src/core/dto/auth/register-member.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { Member } from "src/db/entities/Member";
import { Admin } from "src/db/entities/Admin";
import { IsIn } from "class-validator";
import { REGISTER_SUCCESS } from "src/common/constant/api-response.constant";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/member")
  public async register(@Body() createUserDto: RegisterMemberUserDto) {
    const res: ApiResponseModel<Member> = {} as any;
    try {
      res.data = await this.authService.registerMember(createUserDto);
      res.success = true;
      res.message = `Member ${REGISTER_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("register/member/batch")
  public async registerBatch(
    @Body() createUserDto: RegisterMemberBatchUserDto
  ) {
    const res: ApiResponseModel<Member[]> = {} as any;
    try {
      res.data = await this.authService.registerMemberBatch(
        createUserDto.members
      );
      res.success = true;
      res.message = `Batch register completed!`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @ApiParam({
    name: "type",
    required: true,
    description: "either an ADMIN or MEMBER",
  })
  @Post("login/:type")
  public async loginAdmin(
    @Param("type") type: "ADMIN" | "MEMBER",
    @Body() loginUserDto: LogInDto
  ) {
    const res: ApiResponseModel<Admin | Member> = {} as ApiResponseModel<
      Admin | Member
    >;
    try {
      if (type.toUpperCase().trim() === "ADMIN") {
        res.data = await this.authService.loginAdmin(loginUserDto);
      } else {
        res.data = await this.authService.loginMember(loginUserDto);
      }
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
