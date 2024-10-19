import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// HydratedDocument type to define the type of the ChildDocument
export type ChildDocument = HydratedDocument<Child>;

// Schema for the Child collection
@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
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

  // assesment result list of child
  @Prop({ type:[String], default: [] })
  assessmentResults: String[];

  // program list of child
  @Prop({ type:[String], default: [] })
  programList: String[];

  // avatar URL of child
  @Prop({ default: '' })
  avatar: string;
}

// ChildSchema constant to define the schema for the Child collection
export const ChildSchema = SchemaFactory.createForClass(Child);

// Create age virtual property for child schema to calculate age from date of birth
ChildSchema.virtual('age').get(function() {
  // calculate age from date of birth
  const dob = new Date(this.dateOfBirth);
  // calculate difference in milliseconds
  const diff_ms = Date.now() - dob.getTime();
  // create date object from difference in milliseconds
  const age_dt = new Date(diff_ms);
  // return age in years and months format
  return Math.abs(age_dt.getUTCFullYear() - 1970) + ' years ' + age_dt.getUTCMonth() + ' months';
});
