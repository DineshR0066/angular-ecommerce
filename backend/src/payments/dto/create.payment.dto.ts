import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
        @ApiProperty({ description: 'Associated order ID', example: 'ORD123456' })
        @IsString()
        order_id: string;

        @ApiProperty({ description: 'Sequential number of the payment', example: 1 })
        @IsNumber()
        payment_sequential: number;

        @ApiProperty({ description: 'Type of payment (e.g., credit_card)', example: 'credit_card' })
        @IsString()
        payment_type: string;

        @ApiProperty({ description: 'Number of installments', example: 3 })
        @IsNumber()
        payment_installments: number;

        @ApiProperty({ description: 'Total payment value', example: 150.75 })
        @IsNumber()
        payment_value: number;
}