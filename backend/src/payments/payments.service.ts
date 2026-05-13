import { UpdatePaymentDto } from './dto/update.payment.dto';
import { CreatePaymentDto } from './dto/create.payment.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from 'src/schema/payments.schema';
import path from 'path';

@Injectable()
export class PaymentsService {
    constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment> ) {}
    async getPaymentByPage(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const payments = await this.paymentModel.aggregate([
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
        const totalPayments = payments[0]?.total[0]?.count || 0;
        return {
            page,
            limit,
            totalPayments,
            totalPages: Math.ceil(totalPayments/limit),
            payments
        }
    }

    async getPaymentById(id: string) {
        const payment = await this.paymentModel.findOne(
            {_id: id, is_deleted: false},
        )
        if(!payment) {
            throw new NotFoundException("payment not found");
        }
        return payment;
    }

    async searchByType(type: string) {
        const payments = await this.paymentModel.aggregate([
            {   
                $search:{
                    index: 'default',
                    text: {
                        query: type,
                        path: 'payment_type',
                        fuzzy:{},
                    }
                }
            }
        ]).limit(20);
        return payments;
    }

    async getTotalPaymentByType(type: string) {
        const result = await this.paymentModel.aggregate([
                {
                $match: { 
                    payment_type: type, 
                    is_deleted: false 
                }
                },
                {
                $group: {
                    _id: "$payment_type",
                    totalPayment: { $sum: "$payment_value" }
                }
                }
            ]);
    return result;
    }

    async createPayment(createPaymentDto:CreatePaymentDto) {
        const newPayment = await new this.paymentModel(createPaymentDto);
        return newPayment.save();
    }

    async updatePayment(id: string, updatePaymentdto:UpdatePaymentDto) {
        const updatedPayment = await this.paymentModel.findOneAndUpdate(
            {_id: id , is_deleted: false},
            updatePaymentdto,
            {returnDocument: 'after'},
        )
        if(!updatedPayment) throw new NotFoundException("payment not found");
        return updatedPayment ;
    }

    async deletePayment(id: string) {
        const deletedPayment = await this.paymentModel.findOneAndUpdate(
            {_id: id, is_deleted: false},
            {is_deleted: true},
            {returnDocument: "after"}
        )
        if(!deletedPayment) throw new NotFoundException("payment not found");
        return deletedPayment;
    }
}

