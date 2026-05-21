import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { user, UserSchema} from './../schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports : [MongooseModule.forFeature([{name : user.name , schema : UserSchema}]), MailModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
