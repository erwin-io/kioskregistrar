import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { RegisterMemberBatchUserDto, RegisterMemberUserDto } from "src/core/dto/auth/register-member.dto";
import { Member } from "src/db/entities/Member";
import { Admin } from "src/db/entities/Admin";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: RegisterMemberUserDto): Promise<ApiResponseModel<Member>>;
    registerBatch(createUserDto: RegisterMemberBatchUserDto): Promise<ApiResponseModel<Member[]>>;
    loginAdmin(type: "ADMIN" | "MEMBER", loginUserDto: LogInDto): Promise<ApiResponseModel<Admin | Member>>;
}
