import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { Product, ProductSchema } from 'src/schema/product.schema';
import { MongooseModule } from '@nestjs/mongoose'; 
import { user , UserSchema} from 'src/schema/user.schema';
import {Order, orderSchema } from 'src/schema/orders.schema';
import { OrderItem,orderItemSchema } from 'src/schema/order-items.schema';

@Module({
  imports : [MongooseModule.forFeature([{name : Product.name , schema : ProductSchema},{name : user.name , schema : UserSchema},
    {name: Order.name, schema :orderSchema},{name : OrderItem.name, schema : orderItemSchema}
  ])],
  controllers: [SellerController],
  providers: [SellerService],
  exports:[SellerService]
})
export class SellerModule {}
