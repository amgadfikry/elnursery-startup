import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// HydratedDocument type to define the type of the AdminDocument
export type AdminDocument = HydratedDocument<Admin>;

// Schema for the Admin collection
@Schema()
export class Admin {
  // Unique email address of admin
  @Prop({ required: true, unique: true })
  email: string;

  // Password
  @Prop({ required: true })
  password: string;

  // Full name of admin
  @Prop({ required: true })
  name: string;

  // Avatar URL of admin
  @Prop({ default: null})
  avatar: string;

  // Roles of admin list
  @Prop({ default: [] })
  roles: string[];

  // Token for email forgot password
  @Prop({ default: null })
  forgetPasswordToken: number;

  // Expiry date for email forgot password token
  @Prop({ default: null })
  forgetPasswordTokenExpiry: Date;

  // Boolean to check if password change is required
  @Prop({ default: false })
  changePassword: boolean;
}

// AdminSchema constant to define the schema for the Admin collection
export const AdminSchema = SchemaFactory.createForClass(Admin);
