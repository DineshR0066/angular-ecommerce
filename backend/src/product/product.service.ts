import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schema/product.schema';
import { CreateProductDto, UpdateProductDto } from './../seller/dto/seller.dto';


@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private ProductModel: Model<Product>) {}
    async getAllProduct(){
       const data = await this.ProductModel.find({is_deleted:false});
       return data;
    }

    async createProduct(product : CreateProductDto){
      const data = await this.ProductModel.create({...product, is_deleted:false});
      return data;
    }

    async getSearch(name: string){
       const data = await this.ProductModel.find({product_category_name: {$regex : name, $options : "i"} , is_deleted:false});
       return data;
    }

    async deleteProduct(pid?: string, pname?: string){
      if(pid){
        const data = await this.ProductModel.updateOne({product_id : pid}, {$set:{is_deleted: true}});
        return "deleted successfully";
      }
      const data = await this.ProductModel.updateMany({product_category_name : pname}, {$set:{is_deleted: true}});
      return "deleted successfully";
    }

    async updateProduct(pid?: string, upd? : UpdateProductDto){
      if(!pid){
         return "nothing to update";
      }
      const data = await this.ProductModel.findOneAndUpdate({product_id:pid}, upd, {returnDocument:"after"})
      return "success";
    }
}
