import { IsBoolean, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
        @ApiProperty({ description: 'Reference ID of the order', example: '605c3b5e8e3a9a0f9c2d4e12' })
        @IsString()
        order_id: string;

        @ApiProperty({ description: 'Sequential number of the item in the order', example: 1 })
        @IsNumber()
        order_item_id: number;

        @ApiProperty({ description: 'ID of the product', example: '607d1a3b9c1a8b2f4e5d6c7a' })
        @IsString()
        product_id: string;

        @ApiProperty({ description: 'ID of the seller', example: '607d1a3b9c1a8b2f4e5d6c7b' })
        @IsString()
        seller_id: string;

        @ApiProperty({ description: 'Shipping limit date in ISO format', example: '2025-12-31T23:59:59Z' })
        @IsString()
        shipping_limit_date: string;

        @ApiProperty({ description: 'Price of the individual item', example: 99.99 })
        @IsNumber()
        price: number;

        @ApiProperty({ description: 'Freight value for the item', example: 5.5 })
        @IsNumber()
        freight_value: number;
       
}