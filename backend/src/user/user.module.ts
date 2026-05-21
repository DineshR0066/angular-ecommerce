import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { user, UserSchema } from 'src/schema/user.schema';
import { Order, orderSchema } from 'src/schema/orders.schema';
import { Product, ProductSchema } from 'src/schema/product.schema';
import { OrderItem, orderItemSchema } from 'src/schema/order-items.schema';
import { Payment, paymentSchema } from 'src/schema/payments.schema';
import {  Cart, CartSchema } from 'src/schema/carts.schema'
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports : [MongooseModule.forFeature([
    {name : user.name , schema : UserSchema},
    {name : Order.name , schema : orderSchema},
    {name : Product.name, schema : ProductSchema},
    {name : OrderItem.name, schema : orderItemSchema},
    {name : Payment.name, schema : paymentSchema},
    {name:Cart.name, schema: CartSchema},
  ]),MailModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
