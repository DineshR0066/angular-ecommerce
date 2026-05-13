import { IsString, IsNumber, IsNotEmpty } from "class-validator";
// import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/swagger";

export class CreateSellerDto {
  @ApiProperty({ example: "SELL123" })
  @IsNotEmpty()
  @IsString()
  seller_id: string;

  @ApiProperty({ example: 560001 })
  @IsNumber()
  seller_zip_code_prefix: number;

  @ApiProperty({ example: "bangalore" })
  @IsString()
  seller_city: string;

  @ApiProperty({ example: "KA" })
  @IsString()
  seller_state: string;
}

export class CreateProductDto {
  @ApiProperty({ example: "PROD123" })
  // @IsNotEmpty()
  @IsString()
  product_name: string;

  @ApiProperty({ example: "electronics" })
  @IsString()
  product_category_name: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  product_qty: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  price: number;
 
  @ApiProperty({ example: "https://res.cloudinary.com/dyrw2esoq/image/upload/v1773276662/wyz3btmwssffx3vuzj5o.png" })
  @IsString()
  product_image_url:string;

}

export class UpdateProductDto extends PartialType(CreateProductDto) {}