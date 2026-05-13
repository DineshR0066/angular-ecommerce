import { BuyProductDto, BuyAllDto } from './dto/buyProduct.Dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, orderSchema } from './../schema/orders.schema';
import { user } from './../schema/user.schema';
import { Product } from 'src/schema/product.schema';
import * as crypto from 'crypto';
import { OrderItem } from 'src/schema/order-items.schema';
import { Cart, CartSchema } from 'src/schema/carts.schema'
import { Payment } from 'src/schema/payments.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
    constructor(@InjectModel(Order.name) private OrderModel: Model<Order>,
        @InjectModel(user.name) private UserModel: Model<user>,
        @InjectModel(Product.name) private ProductModel: Model<Product>,
        @InjectModel(OrderItem.name) private OrderItemModel: Model<OrderItem>,
        @InjectModel(Payment.name) private PaymentModel: Model<Payment>,
        @InjectModel(Cart.name) private CartModel: Model<Cart>,
        private mailService: MailService,
    ) { }

    async getAllProduct(uid: string, limit?: number, offset?: number) {
        const data = await this.OrderItemModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order_id',
                    foreignField: 'order_id',
                    as: 'cust_orders'
                }
            },
            {
                $unwind: '$cust_orders',

            },
            {
                $match: {
                    "cust_orders.customer_id": uid
                }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'order_id',
                    foreignField: 'order_id',
                    as: 'cust_pay'
                }
            },
            {
                $unwind: '$cust_pay',
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: 'product_id',
                    as: 'product_details'
                }
            },
            {
                $unwind: '$cust_pay',
            },
            {
                $project: {
                    _id: 0,
                    order_id: '$order_id',
                    product_price: '$price',
                    freight_value: '$freight_value',
                    total_price: '$cust_pay.payment_value',
                    status: '$cust_orders.order_status',
                    payment_type: '$cust_pay.payment_type',
                    Installation: '$cust_pay.payment_installments',
                    estimated_delivery: '$cust_orders.order_estimated_delivery_date',
                    order_at: '$cust_orders.order_purchase_timestamp',
                    product_name: '$product_details.product_name',
                    product_img: '$product_details.product_image_url',
                }
            },
            {
                $skip: offset ? Number(offset) : 0
            },
            {
                $limit: limit ? Number(limit) : 10
            }
        ])
        return data;
    }

    async getDetails(user_id: string) {
        const data = await this.UserModel.findOne({
            user_id,
            is_deleted: false,
        });
        return data;
    }

    async getProducts(limit?: number, offset?: number) {
        const data = await this.ProductModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    product_qty: { $gt: 0 },
                }
            },
            {
                $skip: offset ? Number(offset) : 0,
            },
            {
                $limit: limit ? Number(limit) : 0,
            }
        ]);
        return data;
    }

    async buyProduct(buyProductDto: BuyProductDto) {
        const { product_id, quantity, customer_id, payment_type, payment_installments, address} = buyProductDto;
        const finalAddress = address ;
        const product = await this.ProductModel.findOne({ product_id });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.product_qty < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        const order = await this.OrderModel.create({
            order_id: String(crypto.randomBytes(16).toString('hex')),
            customer_id,
            order_status: "created",
            order_purchase_timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            order_estimated_delivery_date: dayjs().add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
            is_deleted: false,
        });

        const orderItem = await this.OrderItemModel.create({
            order_id: order.order_id,
            order_item_id: 1,
            product_id,
            seller_id: product.seller_id,
            price: product.price,
            freight_value:  Math.max(10, Math.min(25, product.price * 0.03)),
            shipping_limit_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            address: finalAddress,
            is_deleted: false
        });

        const paymentValue = product.price * quantity;

        const payment = await this.PaymentModel.create({
            order_id: order.order_id,
            payment_sequential: 1,
            payment_type,
            payment_installments,
            payment_value: paymentValue,
            is_deleted: false
        });

        await this.ProductModel.updateOne(
            { product_id },
            { $inc: { product_qty: -quantity } }
        );

        const customer = await this.UserModel.findOne({ user_id: customer_id });
        if (customer?.email) {
            this.mailService.sendOrderConfirmation(customer.email, {
                orderId: order.order_id,
                totalAmount: paymentValue,
                items: [{
                name: product.product_name,
                quantity: quantity,
                price: product.price
            }]
            }).catch(err => console.error("Mail failed", err));
            return {
                message: "Order placed successfully",
                order,
                orderItem,
                payment
            };
        }
    }

    async addToCart(uid: string, pid: string) {
        const res = await this.CartModel.insertOne({ product_id: pid, user_id: uid });
        return res;
    }

    async cart(uid: string) {
        const data = await this.CartModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    user_id: uid,
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "product_id",
                    as: "cart"
                }
            },
            {
                $project: {
                    product_id: '$cart.product_id',
                    product_category_name: '$cart.product_category_name',
                    product_image_url: '$cart.product_image_url',
                    price: '$cart.price',
                    product_weight_g: '$cart.product_weight_g',
                    product_height_cm: '$cart.product_height_cm',
                    product_width_cm: '$cart.product_width_cm',
                    product_qty: '$cart.product_qty',
                    quantity: '$quantity',
                }
            }
        ]);
        return data;
    }

    async remove(uid: string, pid: string) {
        const data = await this.CartModel.findOneAndUpdate({ is_deleted: false, product_id: pid, user_id: uid }, { $set: { is_deleted: true } }, { returnDocument: 'after' });
        return data;
    }

    async userDashboard(uid: string) {

        const result = await this.OrderModel.aggregate([

            {
                $match: {
                    customer_id: uid,
                    is_deleted: false
                }
            },

            {
                $lookup: {
                    from: "order-items",
                    localField: "order_id",
                    foreignField: "order_id",
                    as: "items"
                }
            },

            {
                $unwind: {
                    path: "$items",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $group: {
                    _id: "$order_id",

                    order_status: { $first: "$order_status" },

                    order_total: {
                        $sum: {
                            $add: [
                                { $ifNull: ["$items.price", 0] },
                                { $ifNull: ["$items.freight_value", 0] }
                            ]
                        }
                    }
                }
            },

            {
                $group: {
                    _id: null,

                    total_orders: { $sum: 1 },

                    total_spent: { $sum: "$order_total" },

                    delivered_orders: {
                        $sum: {
                            $cond: [
                                { $eq: ["$order_status", "delivered"] },
                                1,
                                0
                            ]
                        }
                    }

                }
            },

            {
                $project: {
                    _id: 0,
                    total_orders: 1,
                    delivered_orders: 1,
                    total_spent: { $round: ["$total_spent", 2] }
                }
            }

        ]);

        return result[0] || {
            total_orders: 0,
            delivered_orders: 0,
            total_spent: 0
        };
    }

    async searchProduct(prod: string, limit: number, offset: number, min?: number, max?: number) {
        const matchQuery: any = {
            is_deleted: false,
            $or: [
                { product_name: { $regex: prod, $options: "i" } },
                { product_category_name: { $regex: prod, $options: "i" } }
            ]
        };

        if (min !== undefined && max !== undefined) {
             const minNum = Number(min);
             const maxNum = Number(max);
             if (!isNaN(minNum) && !isNaN(maxNum)) {
                 matchQuery.price = { $gte: minNum, $lte: maxNum };
             }
        }

        const data = await this.ProductModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $skip: Number(offset),
            },
            {
                $limit: Number(limit),
            },

        ]);
        return data;
    }

    async updateUser(uid: string, body: any) {
        try {
            if (body.data.email) {
                const userExists = await this.UserModel.findOne({ email: body.data.email, user_id: { $ne: uid } });
                if (userExists) {
                    throw new ConflictException("Email already exists");
                }
            }

            const updateData: any = { ...body.data };

            if (body.data.currentPassword && body.data.newPassword) {
                const user = await this.UserModel.findOne({ user_id: uid });
                if (!user) {
                    throw new NotFoundException("User not found");
                }

                const isMatch = await bcrypt.compare(body.data.currentPassword, user.password);
                if (!isMatch) {
                    throw new BadRequestException("Current password is incorrect");
                }
                console.log(updateData)
                const hashedNewPassword = await bcrypt.hash(body.data.newPassword, 10);
                updateData.password = hashedNewPassword;
                
                delete updateData.currentPassword;
                delete updateData.newPassword;
            }
            console.log(updateData)
            const updatedUser = await this.UserModel.findOneAndUpdate(
                { user_id: uid }, 
                { $set: updateData }, 
                { returnDocument: 'after' }
            );

            if (!updatedUser) {
                throw new NotFoundException("User not found");
            }
            return updatedUser;

        } catch (error) {
            if (error instanceof ConflictException || error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error("Profile update error:", error);
            throw new InternalServerErrorException("Failed to update profile");
        }
    }

    async addAddress(uid: string, data: any) {
        console.log(data)
        return await this.UserModel.findOneAndUpdate(
            { user_id: uid },
            { $push: { addresses: data } },
            { returnDocument: 'after'  }
        );
    }

    async deleteAddress(uid: string, data: any) {
        return await this.UserModel.findOneAndUpdate(
            { user_id: uid },
            { $pull: { addresses: { _id: data._id } } },
            { returnDocument: 'after'  }
        );
    }

    async updateAddress(uid: string, addressId: string, data: any) {
        return await this.UserModel.findOneAndUpdate(
            {
                user_id: uid,
                "addresses._id": addressId
            },
            {
                $set: {
                    "addresses.$": data
                }
            },
            { returnDocument: 'after'  }
        );
    }

    async getCategory(category: string, limit: number, page: number) {
        const skip = (page - 1) * limit;
        const data = await this.ProductModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    product_category_name: category,
                }
            },
            {
                $skip: skip,
            },
            {
                $limit: Number(limit),
            }
        ]);
        return data;
    }

    async getAllCategory() {
        const categories = await this.ProductModel.distinct("product_category_name", {
            is_deleted: false,
        });

        return categories.sort();
    }

    async updateCart(uid: string, pid: string, qty: number) {
        if (qty <= 0) {
            await this.CartModel.deleteOne({ user_id: uid, product_id: pid });
            return { message: "Item removed" };
        }

        await this.CartModel.updateOne(
            { user_id: uid, product_id: pid },
            { $set: { quantity: qty } }
        );

        return { message: "Cart updated" };
    }

    async buyAllProducts(dto: BuyAllDto) {

        type OrderItemType = {
            order_id: string;
            order_item_id: number;
            product_id: string;
            seller_id: string;
            price: number;
            freight_value: number;
            shipping_limit_date: string;
            address: any;
            is_deleted: boolean;
        };
        const { customer_id, payment_type, payment_installments, items,address} = dto;
        const finalAddress = address;

        const order_id = crypto.randomBytes(16).toString('hex');

        const order = await this.OrderModel.create({
            order_id,
            customer_id,
            order_status: "created",
            order_purchase_timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            order_estimated_delivery_date: dayjs().add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
            is_deleted: false
        });

        let totalPayment = 0;
        const orderItems: OrderItemType[] = [];
        const mailItems: any[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            const product = await this.ProductModel.findOne({ product_id: item.product_id });

            if (!product) {
                throw new NotFoundException(`Product ${item.product_id} not found`);
            }

            if (product.product_qty < item.quantity) {
                throw new BadRequestException(`Insufficient stock for ${item.product_id}`);
            }

            totalPayment += product.price * item.quantity;

            mailItems.push({
                name: product.product_name,
                quantity: item.quantity,
                price: product.price
            });

            orderItems.push({
                order_id,
                order_item_id: i + 1,
                product_id: item.product_id,
                seller_id: product.seller_id,
                price: product.price,
                freight_value: Math.max(10, Math.min(25, product.price * 0.03)),
                shipping_limit_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                address: finalAddress,
                is_deleted: false
            });

            await this.ProductModel.updateOne(
                { product_id: item.product_id },
                { $inc: { product_qty: -item.quantity } }
            );
        }

        await this.OrderItemModel.insertMany(orderItems);

        const payment = await this.PaymentModel.create({
            order_id,
            payment_sequential: 1,
            payment_type,
            payment_installments,
            payment_value: totalPayment,
            is_deleted: false
        });

        const customer = await this.UserModel.findOne({ user_id:customer_id });

        if (customer?.email) {
            this.mailService.sendOrderConfirmation(customer.email, {
                orderId: order_id,
                totalAmount: totalPayment,
                items: mailItems
            }).catch(err => console.error("Email notification failed:", err));
        }

        return {
            message: "Bulk order placed successfully",
            order,
            orderItems,
            payment
        };
    }
}
