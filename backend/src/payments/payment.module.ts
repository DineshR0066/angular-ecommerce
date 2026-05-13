import { Payment, paymentSchema } from './../schema/payments.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Payment.name,
            schema: paymentSchema
        }])
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService]
})
export class PaymentModule {}