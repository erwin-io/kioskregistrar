export declare class CreateAdminUserAccessDto {
    page: string;
    view: boolean;
    modify: boolean;
    rights: string[];
}
export declare class DefaultAdminUserDto {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    access: CreateAdminUserAccessDto[];
}
export declare class CreateAdminUserDto extends DefaultAdminUserDto {
    userName: string;
    password: string;
    userProfilePic: any;
}
export declare class UpdateAdminUserDto extends DefaultAdminUserDto {
}
