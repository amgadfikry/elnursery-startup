import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';


// HydratedDocument type to define the type of the ChildDocument
export type ChildDocument = HydratedDocument<Child>;

// Schema for the Child collection
@Schema()
export class Child {
  // parent id of child
  @Prop({ required: true, ref: 'User' })
  parentID: string;

  // Full name of child
  @Prop({ required: true })
  name: string;

  // Date of birth of child
  @Prop({ required: true })
  dateOfBirth: string;

  // Age of child
  // Getter to calculate age of child
  get age(): number {
    return new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
  }

  // assesment result list of child
  @Prop({ type:[Types.ObjectId], default: [] })
  assessmentResults: Types.ObjectId[];

  // program list of child
  @Prop({ type:[Types.ObjectId], default: [] })
  programList: Types.ObjectId[];

  // pause program boolean to check if child is paused
  @Prop({ default: false })
  pauseProgram: boolean;

  // avatar URL of child
  @Prop({ default: '' })
  avatar: string;
}

// ChildSchema constant to define the schema for the Child collection
export const ChildSchema = SchemaFactory.createForClass(Child);

