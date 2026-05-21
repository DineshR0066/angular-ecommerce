import { UpdatePaymentDto } from './dto/update.payment.dto';
import { Controller, Get, Post, Patch, Query, Param, NotFoundException, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import mongoose from 'mongoose';
import { CreatePaymentDto } from './dto/create.payment.dto';
import { RolesGuard } from 'src/utility/guards/role.guard';
import { JwtAuthGuard } from 'src/utility/guards/auth.guard';
import { Roles } from 'src/utility/decorators/role.decorator';
import { Role } from 'src/utility/enum/role.enum';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
    constructor( private paymentService: PaymentsService) {}
    // @Get()
    // getPayment() {
    //     return this.paymentService.getPayment();
    // }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Customer)
    @Get()
    @ApiOperation({ summary: 'Retrieve payments with pagination' })
    @ApiQuery({ name: 'page', type: Number, required: true, description: 'Page number' })
    @ApiQuery({ name: 'limit', type: Number, required: true, description: 'Items per page' })
    @ApiResponse({ status: 200, description: 'Paginated payments returned' })
    getPaymentByPage(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number
    ) {
        return this.paymentService.getPaymentByPage(page, limit);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)    
    @Get('search/:payment_type')
    @ApiOperation({ summary: 'Search payments by type' })
    @ApiParam({ name: 'payment_type', description: 'Type of payment to filter' })
    @ApiResponse({ status: 200, description: 'List of payments matching type' })
    searchByType(@Param('payment_type') payment_type: string) {
        return this.paymentService.searchByType(payment_type);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get("total/:payment_type")
    @ApiOperation({ summary: 'Get total value of payments by type' })
    @ApiParam({ name: 'payment_type', description: 'Payment type to aggregate' })
    @ApiResponse({ status: 200, description: 'Total payment calculated' })
    getTotalPaymentByType(@Param('payment_type') payment_type: string) {
        return this.paymentService.getTotalPaymentByType(payment_type);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Customer)
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a single payment by ID' })
    @ApiParam({ name: 'id', description: 'Payment identifier' })
    @ApiResponse({ status: 200, description: 'Payment returned' })
    @ApiResponse({ status: 404, description: 'Payment not found' })
    getPaymentById(@Param('id') id: string) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException('Payment Not found');
        return this.paymentService.getPaymentById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    @ApiOperation({ summary: 'Create a new payment' })
    @ApiResponse({ status: 201, description: 'Payment created successfully' })
    createPayment(@Body() createPaymentDto:CreatePaymentDto) {
        return this.paymentService.createPayment(createPaymentDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch('delete/:id')
    @ApiOperation({ summary: 'Soft delete a payment' })
    @ApiParam({ name: 'id', description: 'Payment identifier' })
    @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
    @ApiResponse({ status: 404, description: 'Payment not found' })
    DeletePayment(@Param('id') id: string) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException('Payment Not found');
        return this.paymentService.deletePayment(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch(":id")
    @ApiOperation({ summary: 'Update an existing payment' })
    @ApiParam({ name: 'id', description: 'Payment identifier' })
    @ApiResponse({ status: 200, description: 'Payment updated successfully' })
    @ApiResponse({ status: 404, description: 'Payment not found' })
    updatePayment(@Param('id') id: string, updatePayementDto:UpdatePaymentDto) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new NotFoundException('Payment Not found');
        return this.paymentService.updatePayment(id, updatePayementDto);
    }
    
}
