import {
    validate,
    validateOrReject,
    Contains,
    IsInt,
    Length,
    IsEmail,
    IsFQDN,
    IsDate,
    Min,
    Max,
    IsNotEmpty,
    IsNumberString,
    ArrayNotEmpty,
    IsOptional,
    IsDateString,
    IsBooleanString
  } from 'class-validator';
  
export class LogInUser {
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    password: string;
}