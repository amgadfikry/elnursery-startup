import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

// UpdateTaskDto is a class that extends the CreateTaskDto class and removes the data and description fields.
export class FilterTaskDto extends PartialType(OmitType(CreateTaskDto, ['data', 'description'] as const)) {}
