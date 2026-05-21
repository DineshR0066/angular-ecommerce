import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from 'src/schema/user.schema';
import { CreateUserDto, VerifyUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(user.name) private userModel: Model<user>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService) { }

    async signUp(signupDto: CreateUserDto) {
        const { username, email, password } = signupDto;
        //const emaill = email.toLowerCase().trim();
        const emailExists = await this.userModel.findOne({email,is_deleted: false,});
        if (emailExists) {
            // return {message:"email already exists"};
            throw new BadRequestException('Email already exists'); 
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = crypto.randomBytes(16).toString('hex');
        const user = await this.userModel.create({ ...signupDto, password: hashedPassword, role: "customer",user_id:userId});
        await user.save();
       // await this.userModel.findOneAndUpdate({ _id: user._id }, { $set: { user_id: user._id.toString() } });
        const { accessToken, refreshToken } = await this.getTokens(user.role, user.email,user.user_id);
        const expires = new Date(Date.now() + 15 * 60 * 1000);
        await this.userModel.findByIdAndUpdate(user._id.toString(), {
            refresh_token: refreshToken,
            refresh_expires: expires,
        });
        //await this.updateRefreshToken(user._id.toString(), refreshToken);
        return { accessToken, refreshToken,userId, email };
    }

    async login(loginDto: VerifyUserDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({email, is_deleted: false});

        if (!user) throw new UnauthorizedException('invalid email or password');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            throw new UnauthorizedException('invalid email or password');

        const { accessToken, refreshToken } = await this.getTokens(user.role, user.email, user.user_id);
        const expires = new Date(Date.now() + 15 * 60 * 1000);
        await this.userModel.findByIdAndUpdate(user._id, { refresh_token: refreshToken, refresh_expires: expires });
        return { accessToken, refreshToken, user:{
            email: user.email,
            role: user.role,
            user_id: user.user_id
        } };
    }

    async logout(userId: string) {
        await this.userModel.findOneAndUpdate({user_id:userId,is_deleted:false}, {$set:{
            refresh_token: null, refresh_expires: null,}
        });
    }


    async refreshTokens(email: string, refreshToken: string) {
        const user = await this.userModel.findOne({ email });
        if (!user || !user.refresh_token) {
            throw new UnauthorizedException('Access denied');
        }

        if (user.refresh_token !== refreshToken) {
            throw new UnauthorizedException('Access denied');
        }
        if (user.refresh_expires && user.refresh_expires < new Date()) {
            await this.userModel.findByIdAndUpdate(user._id, { refresh_token: null, refresh_expires: null });
            throw new UnauthorizedException('Access denied');
        }
        const tokens = await this.jwtService.signAsync( { role: user.role, email: user.email, user_id:user.user_id },
                { secret: this.configService.get('JWT_SECRET'), expiresIn: '1d' },);
        //await this.userModel.findByIdAndUpdate(user._id, { refresh_token: refreshToken });

        return tokens;
    }

    async getTokens(role: string, email: string, user_id:string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { role, email ,user_id},
                { secret: this.configService.get('JWT_SECRET'), expiresIn: '1d' },
            ),
            this.jwtService.signAsync(
                { role, email ,user_id},
                { secret: this.configService.get('REFRESH_TOKEN'), expiresIn: '7d' },
            ),
        ]);

        return { accessToken, refreshToken };
    }

    async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email, is_deleted: false });
        if (!user) {
            return { message: 'If the email exists, reset link sent' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);
        const expires = new Date(Date.now() + 15 * 60 * 1000);
        await this.userModel.findByIdAndUpdate(user._id, {
            passResetToken: hashedToken,
            passResetExpires: expires,
        });
        const resetLink = `http://localhost:4200/auth/reset-password?token=${resetToken}&email=${email}`;
        await this.mailService.sendPasswordReset(email, resetLink);
        return { message: 'If the email exists, reset link sent', token: resetToken };
    }

    async resetPassword(email: string,token: string,newPassword: string) {
        const user = await this.userModel.findOne({ email, is_deleted: false }).select('+passResetToken');
        if (!user || !user.passResetToken || !user.passResetExpires || user.passResetExpires < new Date()) {
            throw new UnauthorizedException('Invalid or expired token');
        }
        const isMatch = await bcrypt.compare(token, user.passResetToken,);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid or expired token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findByIdAndUpdate({_id: user._id, is_deleted: false}, {password: hashedPassword, passResetToken: null,passResetExpires: null,});
        return { message: 'Password reset successful' };
    }
}
