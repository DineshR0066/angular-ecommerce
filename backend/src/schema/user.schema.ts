import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class Address {
  @Prop()
  address_line: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zip_code: number;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema()
export class user extends Document {
   @Prop({ isRequired: true, unique: true })
  username: string;

  @Prop({ isRequired: true })
  password: string;

  @Prop({ isRequired: true, unique: true })
  email: string;

  @Prop({ isRequired: true,default:user })
  role: string;

  @Prop()
  user_id: string;

  @Prop({ default: null })
  refresh_token?: string;

  @Prop({ default: null })
  refresh_expires?: Date;

  @Prop({ default: false, select: false })
  is_deleted: boolean;

  @Prop({ isRequired: true })
  city: string;

  @Prop({ isRequired: true })
  state: string;

  @Prop({ isRequired: true })
  zip_code: number;

  @Prop({ select: false, default: null })
  passResetToken?: string;

  @Prop({ default: null })
  passResetExpires?: Date;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(user);