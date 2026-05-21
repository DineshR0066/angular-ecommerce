import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({_id:false})
class Address {
    @Prop()
    address_line: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    zip_code: string;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ collection: "order-items" })
export class OrderItem {
    @Prop({ required: true })
    order_id: string;
    @Prop({ required: true })
    order_item_id: number;
    @Prop({ required: true })
    product_id: string;
    @Prop({ required: true })
    seller_id: string;
    @Prop({ required: true })
    shipping_limit_date: string;
    @Prop({ required: true })
    price: number;
    @Prop({ required: true })
    freight_value: number;
    @Prop({ type: AddressSchema, required: true })
    address: Address;
    @Prop({ default: false })
    is_deleted: boolean;

}

export const orderItemSchema = SchemaFactory.createForClass(OrderItem);