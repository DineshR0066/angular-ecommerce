import { Controller, Get, Patch, Param, Body, ValidationPipe, Query, Post, UseGuards,Req, ParseIntPipe } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { Product } from "src/schema/product.schema";
import { CreateProductDto, UpdateProductDto } from "./dto/seller.dto";
import { JwtAuthGuard } from "src/utility/guards/auth.guard";
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiBearerAuth, ApiBody, } from "@nestjs/swagger";
import { RolesGuard } from "src/utility/guards/role.guard";
import { Role } from "src/utility/enum/role.enum";
import { Roles } from "src/utility/decorators/role.decorator";

@ApiTags("Sellers")
@ApiBearerAuth()
@Controller("sellers")
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.Seller)

export class SellerController {
    constructor(private sellerService: SellerService) { }

    @Get()
        @ApiOperation({ summary: 'Get user profile details' })
        @ApiResponse({
            status: 200,
            description: 'seller details fetched successfully',
        })
       
        getDetails(@Req() req){
            return this.sellerService.getDetails(req.user.email);
        }


    @Get("products")
    @ApiOperation({ summary: "Get all products of a seller" })
    @ApiResponse({
        status: 200,
        description: "Seller products fetched successfully",
    })
     @ApiQuery({ name: 'limit', type: Number, required: true, description: 'Items per page' })
     @ApiQuery({ name: 'offset', type: Number, required: true, description: 'Items per page' })
    getAllProduct(@Req() req,@Query('limit',ParseIntPipe) limit:number, @Query('page',ParseIntPipe) page:number): Promise<any> {
        return this.sellerService.getAllProduct(req.user.user_id,limit,page);
    }


    @Get("status")
    @ApiOperation({ summary: "Get all products status" })
    @ApiResponse({
        status: 200,
        description: "Seller products fetched successfully",
    })
    productStatus(@Req() res): Promise<Product[]> {
        return this.sellerService.productStatus(res.user.user_id);
    }


    @Get("dashboard")
    @ApiOperation({ summary: "seller dashboard" })
    @ApiResponse({
        status: 200,
        description: "Seller dashboard loaded",
    })
    sellerDashboard(@Req() res): Promise<any> {
        return this.sellerService.sellerDashboard(res.user.user_id);
    }



    @Post(":sid/products")
    @ApiOperation({ summary: "Add product for seller" })
    @ApiParam({
        name: "sid",
        example: "94144541854e298c2d976cb893b81343",
        description: "Seller ID",
    })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({
        status: 201,
        description: "Product added successfully",
    })
    createProduct(
        @Body(ValidationPipe) product: CreateProductDto,
        @Param("sid") sid: string,
    ): Promise<{message:string}> {
        return this.sellerService.createProduct(product, sid);
    }



    @Patch(":sid/products/:pid/delete")
    @ApiOperation({ summary: "Soft delete seller product" })
    @ApiParam({
        name: "sid",
        example: "acef497c1130f71ccfe63aaa1c9a607d",
        description: "seller ID",
    })
    @ApiParam({
        name: "pid",
        example: "beleza_saude",
        description: "Product ID",
    })
    @ApiResponse({
        status: 200,
        description: "Product deleted successfully",
    })
    deleteProduct(
        @Param("sid") sid: string,
        @Param("pid") pid?: string,
        @Query('product_name') pname?:string,
    ): Promise<any> {
        return this.sellerService.deleteProduct(sid, pid,pname);
        
    }




    @Patch(":sid/products/:pid")
    @ApiOperation({ summary: "Update seller product" })
    @ApiParam({
        name: "sid",
        example: "05a360982be454c7e715c0fec4f67243",
        description: "seller ID",
    })
    @ApiParam({
        name: "pid",
        example: "05a360982be454c7e715c0fec4f67243",
        description: "Product ID",
    })
    @ApiBody({ type: UpdateProductDto })
    @ApiResponse({
        status: 200,
        description: "Product updated successfully",
    })
    updateProduct(
        @Param("sid") sid: string,
        @Param("pid") pid: string,
        @Body(ValidationPipe) upd: UpdateProductDto,
    ): Promise<any> {
        return this.sellerService.updateProduct(sid, pid,upd);
    }



    @Get(":sid/prodcts/:name")
    @ApiOperation({ summary: "Search products by name" })
    @ApiParam({
        name: "sid",
        example: "94144541854e298c2d976cb893b81343",
        description: "Seller ID",
    })
    @ApiParam({
        name: "name",
        example: "iphone",
        description: "Product name",
    })
    @ApiResponse({
        status: 200,
        description: "Search results fetched successfully",
    })
    getSearch(@Param("sid") sid: string, @Param("name") name: string,): Promise<Product[]> {
        return this.sellerService.getSearch(sid,name);
    }
}