import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; 
import { user, UserSchema } from 'src/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../utility/strategy/jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { RolesGuard } from './../utility/guards/role.guard';
import { JwtAuthGuard } from '../utility/guards/auth.guard';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: UserSchema }]),
     PassportModule.register({ defaultStrategy: 'jwt' }),
     JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET')!,
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES')!,
          },
        } as JwtModuleOptions; 
      },
    }),MailModule
  ],
  providers: [AuthService, JwtService, JwtStrategy, RolesGuard, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, RolesGuard, JwtAuthGuard],
})
export class AuthModule {}