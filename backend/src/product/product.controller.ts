import {Controller,Get,Post,Body,Param,ValidationPipe,Query,Patch} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './../schema/product.schema';
import { CreateProductDto, UpdateProductDto } from '../seller/dto/seller.dto';
import {ApiTags,ApiOperation,ApiQuery,ApiParam,ApiResponse,ApiBearerAuth,} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/utility/guards/auth.guard';
import { Role } from 'src/utility/enum/role.enum';
import { Roles } from 'src/utility/decorators/role.decorator';
import { RolesGuard } from 'src/utility/guards/role.guard';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Seller)
export class ProductController {
  constructor(private productService: ProductService) {}


  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of products fetched successfully',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  getAllProduct(): Promise<Product[]> {
    return this.productService.getAllProduct();
  }


  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  createProduct(@Body(ValidationPipe) product: CreateProductDto) {
    return this.productService.createProduct(product);
  }


  @Patch('delete')
  @ApiOperation({ summary: 'Soft delete a product' })
  @ApiQuery({
    name: 'product_id',
    required: false,
    example: '84e1b9c6ba2ed178bd217097b41f1251',
    description: 'Product ID',
  })
  @ApiQuery({
    name: 'product_category_name',
    required: false,
    example: 'electronics',
    description: 'Product category name',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  deleteProduct(
    @Query('product_id') pid?: string,
    @Query('product_category_name') pname?: string,
  ): Promise<string> {
    return this.productService.deleteProduct(pid, pname);
  }

 
  @Patch()
  @ApiOperation({ summary: 'Update product details' })
  @ApiQuery({
    name: 'product_id',
    required: false,
    example: 'PROD123',
    description: 'Product ID to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  updateProduct(
    @Query('product_id') pid?: string,
    @Body(ValidationPipe) upd?: UpdateProductDto,
  ): Promise<string> {
    return this.productService.updateProduct(pid, upd);
  }


  @Get(':name')
  @ApiOperation({ summary: 'Search products by name' })
  @ApiParam({
    name: 'name',
    example: 'iphone',
    description: 'Product name to search',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results fetched successfully',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  getSearch(@Param('name') name: string): Promise<Product[]> {
    return this.productService.getSearch(name);
  }
}
