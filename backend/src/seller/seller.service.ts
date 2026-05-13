import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/seller.dto';
import { Product } from './../schema/product.schema';
import { user } from './../schema/user.schema';
import * as crypto from 'crypto';
import { Order } from 'src/schema/orders.schema';
import { OrderItem } from 'src/schema/order-items.schema';


@Injectable()
export class SellerService {

  constructor(@InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(OrderItem.name) private OrderItemModel: Model<OrderItem>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(user.name) private UserModel: Model<user>) { }
  async getAllProduct(sid: string,limit?:number, page?: number) {
    const offset = (Number(page) - 1) * Number(limit);
    const data = await this.ProductModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    seller_id:sid,
                }
            },
            {
                $skip: offset? Number(offset): 0,
            },
            {
                $limit: limit? Number(limit) : 10,
            }
        ]);
        return data;
        
  }

  async createProduct(product: CreateProductDto, sid: string) {
    const prod_id = crypto.randomBytes(16).toString('hex');
    const data = await this.ProductModel.create({ ...product, is_deleted: false, seller_id: sid, product_id: prod_id });
    return { message: "Product added successfully" };
  }

  async getSearch(sid: string, name: string) {
    const data = await this.ProductModel.find({ product_category_name: { $regex: name, $options: "i" }, is_deleted: false, seller_id: sid });
    return data;
  }

  async deleteProduct(sid: string, pid?: string, pname?: string) {
    if (pid) {
      const data = await this.ProductModel.updateOne({ product_id: pid, seller_id: sid }, { $set: { is_deleted: true } });
      if (data.matchedCount === 0) return {message: "No product found with that ID"};
      return {message: "deleted successfully"};

    }
    const data = await this.ProductModel.updateMany({ product_category_name: pname }, { $set: { is_deleted: true } });
    if (data.matchedCount === 0) return {message: "No product found with that ID"};
    return { message: "deleted successfully" };
  }

  async updateProduct(sid: string, pid: string, upd: UpdateProductDto) {
    if (!pid) {
      return { message: "nothing to update" };
    }
    const data = await this.ProductModel.findOneAndUpdate({ product_id: pid, seller_id: sid }, { $set: upd }, { returnDocument:'after'})//{returnDocument:"after"}
    return { message: "success" };
  }

  async getDetails(email: string) {
    const data = await this.UserModel.findOne({
      email,
      is_deleted: false,
    }).select('-_id username email role city state zip_code');
    return data;
  }

  async productStatus(sid: string) {
    const data = await this.OrderItemModel.aggregate([
      {
        $match: {
          is_deleted: false,
          seller_id: sid
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
        $unwind: { path: '$cust_orders', preserveNullAndEmptyArrays: true },

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
        $unwind: { path: '$cust_pay', preserveNullAndEmptyArrays: true }

      },
      {
        $project: {
          _id: 0,
          order_status: '$cust_orders.order_status',
          estimated_delivery_date: '$cust_orders.order_estimated_delivery_date',
          payment_type: '$cust_pay.payment_type',
          Installation: '$cust_pay.payment_installments',
          price: 1,
          freight_value: 1,
          product_id: 1,
          seller_id: 1,
          order_id: 1
        }
      },

    ])
    return data;
  }

  async sellerDashboard(sid: string) {

    const totalProducts = await this.ProductModel.countDocuments({
      seller_id: sid,
      is_deleted: false
    });

    const orderStats = await this.OrderItemModel.aggregate([
      {
        $match: {
          seller_id: sid,
          is_deleted: false
        }
      },
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "order_id",
          as: "order"
        }
      },
      {
        $unwind: "$order"
      },
      {
        $group: {
          _id: "$order.order_status",
          count: { $sum: 1 },
          revenue: {
            $sum: { $add: ["$price", "$freight_value"] }
          }
        }
      }
    ]);

    let statusCounts = {};
    let totalRevenue = 0;
    let totalLoss = 0;

    orderStats.forEach(stat => {
      let status = stat._id?.trim().toLowerCase();
      statusCounts[status] = stat.count;

      if (stat._id === "delivered") {
        totalRevenue += stat.revenue;
      }
      if (stat._id === "cancelled") {
        totalLoss += stat.revenue;
      }
    });

    return {
      totalProducts,
      statusCounts,
      totalRevenue,
      totalLoss
    };
  }
}
