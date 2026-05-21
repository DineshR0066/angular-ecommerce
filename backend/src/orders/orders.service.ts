
import { UpdateOrderDto } from './dto/update.order.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/schema/orders.schema';
import { CreateOrderDto } from './dto/create.order.dto';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order> ) {}

    // async getOrder(){
    //     const orders = await this.orderModel.find({is_deleted: false});
    //     return orders;
    // }

    async getOrderByPage(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const orders = await this.orderModel.aggregate([
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
            const totalOrders = orders[0]?.total[0]?.count || 0;
        return {
            page,
            limit,
            totalOrders,
            totalPages: Math.ceil(totalOrders/limit),
            orders
        }
    }

    async getOrderRevenueByStatus(order_status: string) {
        const result = await this.orderModel.aggregate([
            {
                $match: { order_status: order_status, is_deleted: false }
            },
            {
                $lookup: {
                    from: 'order-items',
                    localField: 'order_id',
                    foreignField: 'order_id',
                    as: 'order_items'
                }
            },
            {
                $unwind: '$order_items',
            },
            {
                $group: {
                _id: '$order_status',
                total_revenue: { $sum: '$order_items.price' },
                },
            },
        ])

        return result;
    }

    async getOrderById(id: string){  
        
        const order = await this.orderModel.findOne({
            _id: id, 
            is_deleted: false
        });
        if(!order) throw new NotFoundException('Order Not found');
        return order;
    }

    async createOrder(createOrderDto: CreateOrderDto){
        const newUser = await new this.orderModel(createOrderDto);
        return newUser.save();
    }

    async updateOrder(id: string, updateOrderDto:UpdateOrderDto) {

        const updatedUser = await this.orderModel.findOneAndUpdate(
            {_id: id , is_deleted:false},
            updateOrderDto,
            {returnDocument: 'after'}
        )
        return updatedUser;
    }

    async deleteOrder(id: string) {
        const deletedUser = await this.orderModel.findOneAndUpdate(
            {_id: id},
            {is_deleted: true},
            {returnDocument: 'after'}
        )
        return deletedUser;
    }

    async updateStatus(oid :string,status:string){
        const res = await this.orderModel.findOneAndUpdate({order_id:oid},{order_status:status},{returnDocument:'after'});
        if(!res){
            return {message:"cant update"}
        }
        return {message:"updated  sucessfully"}
    }

}
