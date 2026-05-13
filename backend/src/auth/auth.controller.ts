
import { Controller, Post, ValidationPipe, Body, Res, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, VerifyUserDto, LogoutDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from "./dto/auth.dto";
import type { Response } from "express";
import { ApiTags, ApiOperation, ApiBody, ApiResponse, } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/utility/guards/auth.guard";


@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post("signup")
    @ApiOperation({ summary: "Register a new user" })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: "User registered successfully",
    })
    async signUp(
        @Body(ValidationPipe) signupDto: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken, userId, email } =
            await this.authService.signUp(signupDto);

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return {
            message: "User registered successfully",
            user_id: userId,
            email:email
        };
    }


    @Post("login")
    @ApiOperation({ summary: "User login" })
    @ApiBody({ type: VerifyUserDto })
    @ApiResponse({
        status: 200,
        description: "User logged in successfully",
    })
    async signin(
        @Body(ValidationPipe) loginDto: VerifyUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken, user } =
            await this.authService.login(loginDto);


        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return {
            message: "User logged in successfully",
            refresh_token: refreshToken,
            user
        };
    }


    @Post("logout")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Logout user" })
    @ApiBody({ type: LogoutDto })
    @ApiResponse({
        status: 200,
        description: "User logged out successfully",
    })
    async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
        await this.authService.logout(req.user.user_id);
        // res.clearCookie("access_token");
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",  
        });
        return { message: "User logged out successfully" };
    }


    @Post("refresh")
    @ApiOperation({ summary: "Refresh access token" })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: "Tokens refreshed successfully",
    })
    async refresh(
        @Body(ValidationPipe) body: RefreshTokenDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.refreshTokens(
            body.email,
            body.refreshToken,
        );

        res.cookie("access_token", tokens, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return { message: "Tokens refreshed successfully" };
    }


    @Post("forgot-password")
    @ApiOperation({ summary: "Send forgot password email" })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: 200,
        description: "Password reset link sent",
    })
    async forgot(@Body(ValidationPipe) body: ForgotPasswordDto) {
        return this.authService.forgotPassword(body.email);
    }


    @Post("reset-password")
    @ApiOperation({ summary: "Reset user password" })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({
        status: 200,
        description: "Password reset successfully",
    })
    async reset(@Body(ValidationPipe) body: ResetPasswordDto) {
        return this.authService.resetPassword(
            body.email,
            body.token,
            body.newPassword,
        );
    }
}
