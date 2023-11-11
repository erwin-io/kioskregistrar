import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { RegisterMemberUserDto } from "src/core/dto/auth/register-member.dto";
import { Member } from "src/db/entities/Member";
import { Users } from "src/db/entities/Users";
import { Admin } from "src/db/entities/Admin";
export declare class AuthService {
    private readonly userRepo;
    private readonly adminRepo;
    private readonly memberRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<Users>, adminRepo: Repository<Admin>, memberRepo: Repository<Member>, jwtService: JwtService);
    registerMemberBatch(dtos: RegisterMemberUserDto[]): Promise<any[]>;
    registerMember(dto: RegisterMemberUserDto): Promise<Member>;
    getByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
    loginAdmin({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Admin>;
    loginMember({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Member>;
}
