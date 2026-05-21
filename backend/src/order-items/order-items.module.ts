import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderItem, orderItemSchema } from "src/schema/order-items.schema";
import { OrderItemsController } from "./order-items.controller";
import { OrderItemsService } from "./order-items.service";

@Module({
    imports: [MongooseModule.forFeature([{
        name: OrderItem.name,
        schema: orderItemSchema
    }])],
    controllers: [OrderItemsController],
    providers: [OrderItemsService],
})
export class OrderItemModule {}
