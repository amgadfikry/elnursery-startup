import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import { Child } from '../../child/schemas/child.schema';

// HydratedDocument type to define the type of the UserDocument
export type UserDocument = HydratedDocument<User>;

// Schema for the User collection
@Schema()
export class User {
  // Unique email address of user
  @Prop({ required: true, unique: true })
  email: string;

  // Password
  @Prop({ required: true })
  password: string;

  // Full name of user
  @Prop({ required: true })
  name: string;

  // Avatar URL of user
  @Prop({ default: null})
  avatar: string;

  // Class of user with default value date of day of creation dd-mm-yyyy
  @Prop({ default: new Date().toLocaleDateString() })
  class: string;

  // Number of children
  @Prop({ default: 1 })
  children: number;

  // list of childern names and ids of children in children collection
  // Is List of child object form of name of child and id of child string or objectID
  // Validate childrenList length not excced  children number
  @Prop({ default: [], ref: Child.name,
    validate: {
      validator: function(value: { name: string, id: string }[]) {
        return value.length <= this.children;
      },
      message: 'Children list length should not exceed children number'
    }
  })
  childrenList: { name: string, id: string }[];

  // isactive boolean to check if user is active
  @Prop({ default: true })
  isActive: boolean;

  // lastActivatedDate date to check when user was last activated
  @Prop({ default: new Date() })
  lastActivatedDate: Date;

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

// UserSchema constant to define the schema for the User collection
export const UserSchema = SchemaFactory.createForClass(User);

// Middleware to update the lastActivatedDate when isActive is updated from false to true
UserSchema.pre<UserDocument>('findOneAndUpdate', function (next) {
  // get the update object
  const update = (this as any).getUpdate();
  // Check if `isActive` is being updated from false to true
  if (update.hasOwnProperty('isActive') && update.isActive === true) {
    // Update the lastActivatedDate to the current date
    update.lastActivatedDate = new Date();
  }
  next();
});
