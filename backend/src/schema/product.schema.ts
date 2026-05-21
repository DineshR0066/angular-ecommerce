
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({collection: 'products'})
export class Product extends Document {
  @Prop({isRequired:true, unique:true})
  product_id: string;

  @Prop({isRequired:true})
  seller_id: string;
  
  @Prop({isRequired:true})
  product_category_name: string;

  @Prop()
  product_qty: number;

  @Prop({default:false, select : false})
  is_deleted : boolean;

  @Prop()
  product_image_url:string;

  @Prop()
  price: number;

  @Prop()
  product_name:string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
