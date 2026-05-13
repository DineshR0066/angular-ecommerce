import { IsString, IsNumber, IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSellerDto {

  @ApiProperty({ example: "rohith" })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 2732 })
  @IsNumber()
  zip_code: number;

  @ApiProperty({ example: "erode" })
  @IsString()
  city: string;

  @ApiProperty({ example: "TN" })
  @IsString()
  state: string;

  @ApiProperty({ example: "rohith" })
  @IsString()
  username: string;

  @ApiProperty({ example: "rohith@gmail.com" })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}