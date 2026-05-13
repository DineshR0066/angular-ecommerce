import { Controller, Param, Body, Get, ValidationPipe, Post, Patch, UseGuards, Req, Query, ParseIntPipe, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/utility/guards/auth.guard';
import { Roles } from 'src/utility/decorators/role.decorator';
import { RolesGuard } from 'src/utility/guards/role.guard';
import { Role } from 'src/utility/enum/role.enum';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { BuyProductDto, BuyAllDto } from './dto/buyProduct.Dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }


    @Get(':uid/products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Customer)
    @ApiOperation({ summary: 'Get all products of a customer' })
    @ApiParam({
        name: 'uid',
        example: 'd3e7d37c0df9aef383f3f2a15b0dddfb',
        description: 'Customer ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Customer products fetched successfully',
    })
    @ApiQuery({ name: 'limit', required: true, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page number' })
    getAllProduct(@Param('uid') uid: string, @Query('limit', ParseIntPipe) limit: number, @Query('page', ParseIntPipe) offset: number) {
        try {
            return this.userService.getAllProduct(uid, limit, offset);
        } catch (err) {
            console.error(err.stack);
        }
    }



    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Customer)
    @ApiOperation({ summary: 'Get user profile details' })
    @ApiResponse({
        status: 200,
        description: 'User details fetched successfully',
    })
    getDetails(@Req() res) {
        return this.userService.getDetails(res.user.user_id);
    }


    @Get("/products")
    @ApiOperation({ summary: 'Display all the products' })
    @ApiResponse({
        status: 200,
        description: 'All products displayed',
    })
    getProducts(@Query('limit', ParseIntPipe) limit: number, @Query('page', ParseIntPipe) offset: number) {
        return this.userService.getProducts(limit, offset);
    }



    @Post('buy')
    @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Customer)
    @ApiOperation({ summary: "Buy product" })
    @ApiBody({ type: BuyProductDto })
    @ApiResponse({
        status: 200,
        description: "Product bought successfully ",
    })
    buyProduct(@Body() buyProductDto: BuyProductDto) {
        return this.userService.buyProduct(buyProductDto);
    }



    @Post(":uid/cart/:pid")
    @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Customer)
    @ApiOperation({ summary: 'Products added to cart' })
    @ApiResponse({
        status: 200,
        description: 'Product added to cart',
    })
    @ApiParam({
        name: 'uid',
        example: 'd3e7d37c0df9aef383f3f2a15b0dddfb',
        description: 'Customer ID',
    })
    @ApiParam({
        name: 'pid',
        example: '7bb6f29c2be57716194f96496660c7c2',
        description: 'Product ID',
    })
    addToCart(@Param("uid") uid: string, @Param("pid") pid: string) {
        return this.userService.addToCart(uid, pid);
    }


    @Get("/cart")
    @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Customer)
    @ApiOperation({ summary: 'fetching cart items' })
    @ApiResponse({
        status: 200,
        description: 'User cartitems fetched successfully',
    })
    cart(@Req() req) {
        return this.userService.cart(req.user.user_id);
    }

    @Patch(":uid/cart/:pid")
    @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Customer)
    @ApiOperation({ summary: 'Removing product from cart' })
    @ApiResponse({
        status: 200,
        description: 'Product removed from cart',
    })
    @ApiParam({
        name: 'uid',
        example: 'd3e7d37c0df9aef383f3f2a15b0dddfb',
        description: 'Customer ID',
    })
    @ApiParam({
        name: 'pid',
        example: '7bb6f29c2be57716194f96496660c7c2',
        description: 'Product ID',
    })
    remove(@Param("uid") uid: string, @Param("pid") pid: string) {
        return this.userService.remove(uid, pid);
    }


    @Patch(":uid/cart/:pid/update")
    @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Customer)
    @ApiOperation({ summary: 'Updating the quantity value' })
    @ApiResponse({
        status: 200,
        description: 'Quantity increased',
    })
    @ApiParam({
        name: 'uid',
        example: 'd3e7d37c0df9aef383f3f2a15b0dddfb',
        description: 'Customer ID',
    })
    @ApiParam({
        name: 'pid',
        example: '7bb6f29c2be57716194f96496660c7c2',
        description: 'Product ID',
    })
    updateCart(@Param("uid") uid: string, @Param("pid") pid: string, @Body("qty") qty: number): Promise<{ message: string }> {
        return this.userService.updateCart(uid, pid, qty);
    }


    @Get("dashboard")
    @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Customer)
    @ApiOperation({ summary: "Customer dashboard" })
    @ApiResponse({
        status: 200,
        description: "Customer dashboard loaded",
    })
    userDashboard(@Req() res): Promise<any> {
        return this.userService.userDashboard(res.user.user_id);
    }

    @Get("catalog/:prod")

    @ApiOperation({ summary: "Search products" })
    @ApiResponse({
        status: 200,
        description: "Products loaded",
    })
    searchProduct(@Param("prod") prod: string, @Query("limit") limit: number, @Query("page") offset: number, @Query("min") min?: number, @Query("max") max?: number): Promise<any> {
        return this.userService.searchProduct(prod, limit, offset, min, max);
    }

    @Patch(":uid/edit")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update customer profile" })
    @ApiResponse({
        status: 200,
        description: "Profile updated successfully",
    })
    async updateUser(@Param("uid") uid: string, @Body() data: any) {
        try {
            return this.userService.updateUser(uid, data);
        } catch (error) {
            console.error(error.code)
            if (error.code === 11000) {
                throw new ConflictException('Duplicate value found');
            }
            throw error;
        }

    }

    @Patch("address/add/:uid")
    @UseGuards(JwtAuthGuard, RolesGuard)
    async addAddress(@Param("uid") uid: string, @Body() body: any) {
        return this.userService.addAddress(uid, body.data);
    }

    @Patch("address/delete/:uid")
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteAddress(@Param("uid") uid: string, @Body() body: any) {
        return this.userService.deleteAddress(uid, body.data);
    }

    @Get("all-category")
    @ApiOperation({ summary: "Get all categories" })
    @ApiResponse({
        status: 200,
        description: "categories loaded",
    })
    getAllCategory() {
        return this.userService.getAllCategory();
    }

    @Get("category/:name")
    @ApiOperation({ summary: "Cataegory for user" })
    @ApiParam({
        name: 'name',
        example: 'furniture',
        description: "Product category"
    })
    @ApiResponse({
        status: 200,
        description: "Products loaded",
    })
    getCategory(@Param('name') category: string,
        @Query('limit') limit: number,
        @Query('page') page: number) {
        return this.userService.getCategory(category, limit, page);
    }

    @Post('bulk-buy')
    @ApiOperation({ summary: "Buy product" })
    @ApiBody({ type: BuyAllDto })
    @ApiResponse({
        status: 200,
        description: "Product bought successfully ",
    })
    buyAllProducts(@Body() buyProductDto: BuyAllDto) {
        return this.userService.buyAllProducts(buyProductDto);
    }


}
