import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// HydratedDocument type to define the type of the TaskDocument
export type TaskDocument = HydratedDocument<Task>;

// Schema for the Tasks collection
@Schema()
export class Task {
  // Title field of the Task
  @Prop({ required: true })
  title: string;

  // Category field of the Task
  @Prop({ required: true })
  category: string;

  // Description field of the Task
  @Prop({ default: '' })
  description: string;

  // Data field of the Task
  @Prop({ required: true })
  data: string;

  // Level field of the Task
  @Prop({ default: 0 })
  level: number;
}

// TaskSchema constant to define the schema for the Tasks collection
const TaskSchema = SchemaFactory.createForClass(Task);
// create compound index on title and category fields for unique constraint
TaskSchema.index({ title: 1, category: 1 }, { unique: true });
export { TaskSchema };
