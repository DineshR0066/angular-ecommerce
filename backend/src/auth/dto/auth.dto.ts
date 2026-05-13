import { IsString, IsNotEmpty, IsNumber, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: "lipigava.22it@kongu.edu" })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: "lipiga" })
    @IsString()
    username: string;

    @ApiProperty({
        example: "lipiga"
    })
    @IsString()
    password: string;

    @ApiProperty({ example: 600001 })
    @IsNumber({})
    @IsNotEmpty()
    zip_code: number;

    @ApiProperty({ example: "chennai" })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: "TN" })
    @IsString()
    @IsNotEmpty()
    state: string;
}

export class VerifyUserDto {
    @ApiProperty({ example: "lipigava.22it@kongu.edu" })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        example: "lipiga"
    })
    @IsString()
    password: string;


}

export class LogoutDto {
    @ApiProperty({ example: "65f2a1b2c3d4" })
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class RefreshTokenDto {
    @ApiProperty({ example: "lipigava.22it@Kongu.edu" })
    @IsString()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImVtYWlsIjoibGlwaWdhdmEuMjJpdEBrb25ndS5lZHUiLCJpYXQiOjE3NzI1MDY4OTYsImV4cCI6MTc3MzExMTY5Nn0.A528BU5WSx38KFU3Avs7HCKm95-BkPYVrNWZy_f4_wA" })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: "user@gmail.com" })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: "user@gmail.com" })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "reset-token-123" })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        example: "NewPass@123",
        writeOnly: true,
    })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
