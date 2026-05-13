import { Type } from 'class-transformer'
import { IsString, IsNumber ,IsArray, ValidateNested} from "class-validator";


export class AddressDto {
  @IsString()
  address_line: string;
  @IsString()
  city: string;
  @IsString()
  state: string;
  @IsString()
  zip_code: string;
}

export class BuyProductDto {

  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;

  @IsString()
  customer_id: string;

  @IsString()
  payment_type: string;

  @IsNumber()
  payment_installments: number;

  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}

export class ItemDto {
  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;
}

export class BuyAllDto {
  @IsString()
  customer_id: string;

  @IsString()
  payment_type: string;

  @IsNumber()
  payment_installments: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}

