import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDocument, Task } from './schemas/task.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession } from 'mongoose';
import { FilterTaskDto } from './dto/filter-task.dto';
import { ReturnedTaskDto } from './dto/returned-task.dto';

/* Task Service with methods for CRUD operations
    Attributes:
      taskModel: Model for Task schema
    Methods:
      -create: Create a new task
      -findAll: Get all tasks records
      -findOne: Get task by id
      -update: Update task by id
      -remove: Delete task by id
*/
@Injectable()
export class TaskService {
  // Inject the Task model
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  /* Create a new task and return the created task
      Parameters:
        - createTaskDto: task details to create a new task
        - session: ClientSession for the transaction (Optional)
      Returns:
        - created task details in ReturnedTaskDto format
      Errors:
        - InternalServerErrorException: An error occurred while creating the task
        - ConflictException: If task with the title already exist with the same category
  */
  async create(createTaskDto: CreateTaskDto, session: ClientSession = null) : Promise<Task> {
    try {
      const newTask = new this.taskModel(createTaskDto);
      const createdTask = await newTask.save({ session });
      return createdTask;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Task with the title already exist with the same category');
      }
      throw new InternalServerErrorException('An Error occurred while creating the task');
    }
  }

  /* Get all tasks with or without filters options and return the tasks
      Parameters:
        - filters: Filters to apply on the tasks (Optional)
      Returns:
        - Array of tasks in ReturnedTaskDto format
      Errors:
        - InternalServerErrorException: An error occurred while fetching the tasks
  */
  async findAll(filters: FilterTaskDto) : Promise<Task[]> {
    try {
      const query = {};
      /// Apply filters on the query object
      if (filters) {
        query['title'] = filters.title ? { $regex: filters.title, $options: 'i' } : { $exists: true };
        query['category'] = filters.category ? { $regex: filters.category, $options: 'i' } : { $exists: true };
        query['level'] = filters.level ? filters.level : { $exists: true };
      }
      const tasks = await this.taskModel.find(query).exec();
      return tasks;
    } catch (error) {
      throw new InternalServerErrorException('An Error occurred while fetching the tasks');
    }
  }

  /* Get task by id and return the task
      Parameters:
        - id: Task id to find the task
      Returns:
        - Task details in ReturnedTaskDto format
      Errors:
        - NotFoundException: If task with the id not found
        - InternalServerErrorException: An error occurred while fetching the task
  */
  async findOne(id: string) : Promise<Task> {
    try {
      const task = await this.taskModel.findById(id).exec();
      if (!task) {
        throw new NotFoundException('Task with the id not found');
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while fetching the task');
    }
  }

  /* Update task by id and return the updated task
      Parameters:
        - id: Task id to update the task
        - updateTaskDto: Task details to update the task
        - session: ClientSession for the transaction (Optional)
      Returns:
        - Updated task details in ReturnedTaskDto format
      Errors:
        - NotFoundException: If task with the id not found
        - InternalServerErrorException: An error occurred while updating the task
  */
  async update(id: string, updateTaskDto: UpdateTaskDto, session: ClientSession = null) : Promise<Task> {
    try {
      const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true, session }).exec();
      if (!updatedTask) {
        throw new NotFoundException('Task with the id not found');
      }
      return updatedTask;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while updating the task');
    }
  }

  /* Delete task by id and return message
      Parameters:
        - id: Task id to delete the task
        - session: ClientSession for the transaction (Optional)
      Returns:
        - Message for task deletion
      Errors:
        - NotFoundException: If task with the id not found
        - InternalServerErrorException: An error occurred while deleting the task
  */
  async remove(id: string, session: ClientSession = null) : Promise<{ message: string }> {
    try {
      const deletedTask = await this.taskModel.findByIdAndDelete(id, { session }).exec();
      if (!deletedTask) {
        throw new NotFoundException('Task with the id not found');
      }
      return { message: 'Task deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while deleting the task');
    }
  }
}
