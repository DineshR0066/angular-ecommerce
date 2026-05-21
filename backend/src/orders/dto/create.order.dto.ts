import { IsBoolean, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
        @ApiProperty({ description: 'Unique order identifier', example: 'ORD123456' })
        @IsString()
        order_id: string; 

        @ApiProperty({ description: 'Customer identifier', example: 'CUS987654' })
        @IsString()
        customer_id: string;

        @ApiProperty({ description: 'Status of the order', example: 'delivered' })
        @IsString()
        order_status: string; 

        @ApiProperty({ description: 'Timestamp when purchase was made', example: '2025-01-01T10:00:00Z' })
        @IsString()
        order_purchase_timestamp: string; 

        @ApiProperty({ description: 'Timestamp when order was approved', example: '2025-01-02T12:00:00Z' })
        @IsString()
        order_approved_at ?: string; 

        @ApiProperty({ description: 'Carrier delivery date', example: '2025-01-05T15:00:00Z' })
        @IsString()
        order_delivered_carrier_date ?: string; 

        @ApiProperty({ description: 'Customer delivery date', example: '2025-01-06T18:00:00Z' })
        @IsString()
        order_delivered_customer_date ?: string; 

        @ApiProperty({ description: 'Estimated delivery date', example: '2025-01-07T20:00:00Z' })
        @IsString()
        order_estimated_delivery_date ?: string; 
       
}