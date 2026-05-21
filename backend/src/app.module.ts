import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItemModule } from './order-items/order-items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './payments/payment.module';

import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { ProductModule } from './product/product.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB'),
      }),
    }),
   ProductModule, SellerModule, ConfigModule, AdminModule,AuthModule, MailModule, UserModule,OrderItemModule,PaymentModule,OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

