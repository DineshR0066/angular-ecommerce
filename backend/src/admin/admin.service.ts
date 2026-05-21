import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { user } from './../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSellerDto } from './dto/admin.dto';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
@Injectable()
export class AdminService {
    constructor(@InjectModel(user.name) private UserModel: Model<user>, private mailService: MailService) { }

    async getAdmin(email: string) {
        const admin = await this.UserModel.findOne({
                email,
                is_deleted: false,
            }).select('-_id username email role city state zip_code');
            return admin;
        
    }

    async getAllSeller(limit?: number, offset?: number) {
        //const data = await this.UserModel.find({is_deleted : false, role : "seller"});
        const data = await this.UserModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    $text: { $search: "seller" }
                }
            },
            {
                $skip: Number(offset),
            },
            {
                $limit: Number(limit),
            },
            {
                $project: {
                    id:"$_id",
                    // seller_id: { $toString: "$_id" },
                    seller_id: "$user_id",
                    seller_name: "$username",
                    seller_email: "$email",
                    seller_city: "$city",
                    seller_state: "$state",
                    seller_zip_code: "$zip_code",
                }
            }
        ]);
        return data;
    }

    async deleteSeller(sid: string) {
        const objectId = new Types.ObjectId(sid);
        const data = await this.UserModel.findOneAndUpdate({ _id: objectId, is_deleted: false }, { $set: { is_deleted: true } });
        if (!data) {
            throw new NotFoundException('Seller not found or already deleted');
        }
        return {message:"success"};
    }

    async getAllCustomer(limit?: number, offset?: number) {
        //const data = await this.CustomerModel.find({is_deleted : false});
        const data = await this.UserModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    $text: { $search: "customer" }
                }
            },
            {
                $skip: Number(offset),
            },
            {
                $limit: Number(limit),
            },
            {
                $project: {
                    _id: 0,
                    //customer_id: { $toString: "$_id" },
                    customer_id:"$user_id",
                    customer_name: "$username",
                    customer_email: "$email",
                    customer_city: "$city",
                    customer_state: "$state",
                    customer_zip_code: "$zip_code",
                }
            }
        ]);
        return data;
    }

    async addSeller(seller: CreateSellerDto) {
        const email = seller.email.toLowerCase().trim();
        const emailExists = await this.UserModel.findOne({ email, is_deleted: false,});
        if (emailExists) {
            throw new BadRequestException('Email already exists');
        }
        const pass = await bcrypt.hash(seller.password, 10);
        const password = seller.password;
        seller.password = pass;
        const userId = crypto.randomBytes(16).toString('hex');
        const result = { ...seller, role: "seller", is_deleted: false, user_id:userId };
        const data = await this.UserModel.create(result);
        if (!data) {
            throw new HttpException('cannot add Data', HttpStatus.BAD_REQUEST) ;
        }
        await this.mailService.sendSellerCredentials(
            data.email,
            data.username,
            password,
        );
        return {message:"successfuly added"};
    }

    async getCount() {
        const data = await this.UserModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    $text: { $search: "customer" }
                }
            },
            {
                $group: {
                    _id: "$city",
                    count: { $sum: 1 },
                }
            },
            {
                $project: {
                    city: '$_id',
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { count: -1 }
            }
        ])
        return data;
    }

    async searchUser(city: string, limit: number, offset: number) {
        const data = await this.UserModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    $text: { $search: city }
                }
            },
            {
                $skip: Number(offset),
            },
            {
                $limit: Number(limit),
            },
            {
                $group: {
                    _id: "$role",
                    users: {
                        $push: {
                            //user_id: { $toString: "$_id" },
                            user_id: "$user_id",
                            email: "$email",
                            username: "$username",
                            role: "$role",
                        }
                    },
                    count: { $sum: 1 },
                }
            }
            
        ]);
        return data;
    }
}
