import { Controller, Get, Post, Patch, Param, Body, NotFoundException, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import mongoose from 'mongoose';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create.order-item.dto';
import { UpdateOrderItemDto } from './dto/update.order-item.dto';
import { RolesGuard } from 'src/utility/guards/role.guard';
import { JwtAuthGuard } from 'src/utility/guards/auth.guard';
import { Role } from 'src/utility/enum/role.enum';
import { Roles } from 'src/utility/decorators/role.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Order Items')
@ApiBearerAuth()
@Controller('order-items')
export class OrderItemsController {
    constructor( private orderItemService: OrderItemsService) {}

    // @Get()
    // getOrderItem() {
    //     return this.orderItemService.getOrderItems()
    // }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Customer)
    @Get()
    @ApiOperation({ summary: 'Retrieve order items with pagination' })
    @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: true, type: Number, description: 'Items per page' })
    @ApiResponse({ status: 200, description: 'Paginated list of order items returned' })
    getOrderItem(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number
    ) {
        return this.orderItemService.getOrderItemByPage(page, limit);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get("seller-cost/:seller_id")
    @ApiOperation({ summary: 'Get total price of order items by seller ID' })
    @ApiParam({ name: 'seller_id', description: 'Seller identifier' })
    @ApiResponse({ status: 200, description: 'Total price calculated' })
    getTotalPriceBySellerId(@Param('seller_id') seller_id: string) {
        return this.orderItemService.getTotalPriceBySellerId(seller_id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get("product-cost/:product_id")
    @ApiOperation({ summary: 'Get total price of order items by product ID' })
    @ApiParam({ name: 'product_id', description: 'Product identifier' })
    @ApiResponse({ status: 200, description: 'Total price calculated' })
    getTotalPriceByProductId(@Param('product_id') product_id: string) {
        return this.orderItemService.getTotalPriceByProductId(product_id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get("expense-by-seller/:seller_id")
    @ApiOperation({ summary: 'Get total freight expense by seller ID' })
    @ApiParam({ name: 'seller_id', description: 'Seller identifier' })
    @ApiResponse({ status: 200, description: 'Total expense calculated' })
    getExpenseBySellerId(@Param('seller_id') seller_id: string) {
        return this.orderItemService.getExpenseBySellerId(seller_id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Roles(Role.Admin, Role.Customer)
    @Get(':id')
    @ApiOperation({ summary: 'Get a single order item by its ID' })
    @ApiParam({ name: 'id', description: 'Order item identifier' })
    @ApiResponse({ status: 200, description: 'Order item returned' })
    @ApiResponse({ status: 404, description: 'Order item not found' })
    getOrderItemById(@Param('id') id: string ) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException("order item not found");
        return this.orderItemService.getOrderItemById(id);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    @ApiOperation({ summary: 'Create a new order item' })
    @ApiResponse({ status: 201, description: 'Order item created successfully' })
    createOrderItem(@Body() createOrderItemDto: CreateOrderItemDto) {
        return this.orderItemService.createOrderItem(createOrderItemDto);
    }

   
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch('delete/:id')
    @ApiOperation({ summary: 'Soft delete an order item' })
    @ApiParam({ name: 'id', description: 'Order item identifier' })
    @ApiResponse({ status: 200, description: 'Order item deleted successfully' })
    @ApiResponse({ status: 404, description: 'Order item not found' })
    deleteOrderItem(@Param('id') id: string) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException("order item not found");
        return this.orderItemService.deleteOrderItem(id);
    }

     @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing order item' })
    @ApiParam({ name: 'id', description: 'Order item identifier' })
    @ApiResponse({ status: 200, description: 'Order item updated successfully' })
    @ApiResponse({ status: 404, description: 'Order item not found' })
    updateOrderItem(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException("order item not found");
        return this.orderItemService.updateOrderItem(id, updateOrderItemDto);
    }


}
