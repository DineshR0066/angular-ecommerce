import { Controller, Get, Param, Post, Body, Patch, Query, NotFoundException, ParseIntPipe, UseGuards,ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import mongoose from 'mongoose';
import { RolesGuard } from './../utility/guards/role.guard';
import { JwtAuthGuard } from 'src/utility/guards/auth.guard';
import { Roles } from 'src/utility/decorators/role.decorator';
import { Role } from 'src/utility/enum/role.enum';
import {ApiTags,ApiOperation,ApiQuery,ApiParam,ApiResponse,ApiBearerAuth,ApiBody} from '@nestjs/swagger';
import { UpdateProductDto } from 'src/seller/dto/seller.dto';
import { SellerService } from 'src/seller/seller.service';


@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor( private orderService: OrdersService,private sellerService:SellerService) {}
    // @Get()
    // getOrders() {
    //     return this.orderService.getOrder()
    // }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Customer)
    @Get()
    @ApiOperation({ summary: 'Retrieve orders with pagination' })
    @ApiQuery({ name: 'page', type: Number, required: true, description: 'Page number' })
    @ApiQuery({ name: 'limit', type: Number, required: true, description: 'Items per page' })
    @ApiResponse({ status: 200, description: 'Paginated orders returned' })
    getOrderByPage(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number
     ) {
        return this.orderService.getOrderByPage(page, limit);
     }

     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.Admin)
     @Get('order-status/:order_status')
     @ApiOperation({ summary: 'Get order revenue filtered by status' })
     @ApiParam({ name: 'order_status', description: 'Status to filter orders' })
     @ApiResponse({ status: 200, description: 'Revenue calculated' })
     getOrderRevenueByStatus(@Param('order_status') order_status: string) {
        return this.orderService.getOrderRevenueByStatus(order_status);
     }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Customer)
    @Get(':id') 
    @ApiOperation({ summary: 'Retrieve a single order by ID' })
    @ApiParam({ name: 'id', description: 'Order identifier' })
    @ApiResponse({ status: 200, description: 'Order returned' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    getOrdersById(@Param('id') id: string) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException('Order Not found');
        return this.orderService.getOrderById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    createOrder(@Body() createOrderDto:CreateOrderDto){
        return this.orderService.createOrder(createOrderDto);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch('delete/:id')
    @ApiOperation({ summary: 'Soft delete an order' })
    @ApiParam({ name: 'id', description: 'Order identifier' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    deleteOrder (@Param('id') id: string) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException('Order Not found');
        return this.orderService.deleteOrder(id);
    }

    @Patch(":oid/:status")
        @ApiOperation({ summary: "Update product status" })
        @ApiParam({
            name: "oid",
            example: "47770eb9100c2d0c44946d9cf07ec65d",
            description: "product ID",
        })
        @ApiParam({
            name: "status",
            example: "Delivered",
            description: "product status",
        })
        @ApiResponse({
            status: 200,
            description: "status updated successfully",
        })
        updateStatus( @Param("oid") oid: string, @Param("status") status : string ): Promise<any> {
            return this.orderService.updateStatus(oid,status);
        }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing order' })
    @ApiParam({ name: 'id', description: 'Order identifier' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    updateOrder(@Param('id') id: string,@Body() updateOrderDto: UpdateOrderDto) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException('Order Not found');
        return this.orderService.updateOrder(id, updateOrderDto);
    }
    
}
