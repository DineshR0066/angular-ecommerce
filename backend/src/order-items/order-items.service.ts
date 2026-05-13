import { UpdateOrderItemDto } from './dto/update.order-item.dto';
import { CreateOrderItemDto } from './dto/create.order-item.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderItem } from 'src/schema/order-items.schema';

@Injectable()
export class OrderItemsService {
    constructor(@InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>) {}

    // async getOrderItems() {
    //     return await this.orderItemModel.find()
    // }

    async getOrderItemByPage(page: number, limit: number) {
        const skip = (page -1 ) * limit;
        const orderItems = await this.orderItemModel.aggregate([
            {
                $match: {is_deleted: false}
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    total: [
                        { $count: "count" }
                    ]
                }
            }])
            const totalOrderItems = orderItems[0]?.total[0]?.count || 0;
        return {
            page,
            limit,
            totalOrderItems,
            totalPages: Math.ceil(totalOrderItems/limit),
            orderItems
        }
    }

    async getOrderItemById(id: string) {
        const orderItem = await this.orderItemModel.findOne({
            _id: id,
            is_deleted: false,
        })
        if(!orderItem) throw new NotFoundException("order item not found")
        return orderItem;
    }

    async getTotalPriceBySellerId(seller_id: string) {
        const orderItems = await this.orderItemModel.find({seller_id, is_deleted: false});
        const totalPrice = orderItems.reduce((total, item) => total + item.price, 0);
        return {seller_id, totalPrice};
    }

    async getTotalPriceByProductId(product_id: string) {
        const orderItems = await this.orderItemModel.find({product_id, is_deleted: false});
        const totalPrice = orderItems.reduce((total, item) => total + (item.price ) , 0);
        return {product_id, totalPrice};
    }

    async getExpenseBySellerId(seller_id: string) {
        const orderItems = await this.orderItemModel.find({seller_id, is_deleted: false});
        const totalExpense = orderItems.reduce((total, item) => total +  item.freight_value , 0);
        return {seller_id, totalExpense};
    }

    async createOrderItem(createOrderItemDto: CreateOrderItemDto) {
        const newUser = await new this.orderItemModel(createOrderItemDto);
        return {message: "Order item created successfully", data: await newUser.save()};
    }

    async updateOrderItem(id: string, updateOrderItemDto: UpdateOrderItemDto ) {
        const updatedOrderItem = await this.orderItemModel.findOneAndUpdate(
            {_id: id, is_deleted: false},
            updateOrderItemDto,
            {returnDocument: 'after'}
        )
        if(!updatedOrderItem) throw new NotFoundException("order item not found")
        return {message: "Order item updated successfully", data: updatedOrderItem};
    }

    async deleteOrderItem(id: string) {
        const deletedOrderItem = await this.orderItemModel.findOneAndUpdate(
            {_id: id, is_deleted: false},
            {is_deleted: true},
            {returnDocument: 'after'}
        )
        if(!deletedOrderItem) throw new NotFoundException("order item not found");
        return {message: "Order item deleted successfully", data: deletedOrderItem};
    }
}
