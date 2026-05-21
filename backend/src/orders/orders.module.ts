import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Order, orderSchema } from 'src/schema/orders.schema';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SellerModule } from 'src/seller/seller.module';

@Module({
    imports: [SellerModule,MongooseModule.forFeature([{
        name: Order.name,
        schema: orderSchema,
        }])],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
