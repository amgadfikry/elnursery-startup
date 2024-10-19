import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserType } from '../common/decorators/userType-guard.decorator';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ReturnedTaskDto } from './dto/returned-task.dto';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from './schemas/task.schema';

/* Task Controller with methods for CRUD operations
    Attributes:
      taskService: TaskService for CRUD operations
    Methods:
      -create: Create a new task
      -findAll: Get all tasks records
      -findOne: Get task by id
      -update: Update task by id
      -remove: Delete task by id
*/
@ApiTags('Task')
@Controller('tasks')
export class TaskController {
  // Inject the TaskService
  constructor(private readonly taskService: TaskService) {}

  // POST /tasks - create a new task
  @Post()
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedTaskDto)) // Transform the response to the ReturnedTaskDto
  @ApiOperation({ summary: 'Create a new task item (admin only)' })
  @ApiResponse({ status: 200, description: 'Successful create a new task record.', type: ReturnedTaskDto })
  @ApiErrorResponses([400, 401, 404, 409, 500]) // Custom error responses Swagger decorator
  async create(@Body() createTaskDto: CreateTaskDto) : Promise<Task> {
    return await this.taskService.create(createTaskDto);
  }

  // GET /tasks - get all tasks records
  @Get()
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedTaskDto)) // Transform the response to the ReturnedTaskDto
  @ApiOperation({ summary: 'Get list of tasks either all or filtered by query parameters (admin only)' })
  @ApiResponse({ status: 200, description: 'Successful retrieval list of tasks records.', type: ReturnedTaskDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findAll(@Query() filters?: FilterTaskDto): Promise<Task[]> {
    return await this.taskService.findAll(filters);
  }

  // GET /tasks/:id - get task by id
  @Get(':id')
  @UseInterceptors(new TransformInterceptor(ReturnedTaskDto)) // Transform the response to the ReturnedTaskDto
  @ApiOperation({ summary: 'Get a specific task item using id (admin/user)' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of task record.', type: ReturnedTaskDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findOne(@Param('id') id: string) : Promise<Task> {
    return await this.taskService.findOne(id);
  }

  // PATCH /tasks/:id - update task by id
  @Patch(':id')
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedTaskDto)) // Transform the response to the ReturnedTaskDto
  @ApiOperation({ summary: 'Update an existing task item using id (admin only)' })
  @ApiResponse({ status: 200, description: 'Successful update task record.', type: ReturnedTaskDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) : Promise<Task> {
    return await this.taskService.update(id, updateTaskDto);
  }

  // DELETE /tasks/:id - delete task by id
  @Delete(':id')
  @UserType('admin') // Check if the user type is admin
  @ApiOperation({ summary: 'Delete a specific task item using id (admin only)' })
  @ApiResponse({ status: 200, description: 'Successful delete task from records.'})
  @ApiErrorResponses([400, 401, 404, 500])
  async remove(@Param('id') id: string) : Promise<{ message: string }> {
    return await this.taskService.remove(id);
  }
}
