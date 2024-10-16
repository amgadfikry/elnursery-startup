import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ReturnedUserDto } from './dto/returned-user.dto';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';
import { User } from './schemas/user.schema';
import { UserType } from '../common/decorators/userType-guard.decorator';

/* User Controller with CRUD operations
    Attributes:
      userService: Service for user operations
    Methods:
      -create (POST): Create a new user account
      -findAll (GET): Get all user records
      -findOne (GET): Get user by id
      -update (PATCH): Update user by id
      -remove (DELETE): Delete user by id
*/
@ApiTags('User')
@Controller('user')
export class UserController {
  // Inject the UserService to the UserController
  constructor(private readonly userService: UserService) {}

  // POST /user - create a new user account
  @Post()
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedUserDto)) // Transform the response to the ReturnedUserDto
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({ status: 200, description: 'Successful create a new user record.', type: ReturnedUserDto })
  @ApiErrorResponses([400, 401, 404, 409, 500]) // Custom error responses Swagger decorator
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  // GET /user - get all users records
  @Get()
  @UserType('admin') // Check if the user type is admin
  @ApiQuery({ name: 'classCategory', required: false }) // Query parameter for classCategory
  @UseInterceptors(new TransformInterceptor(ReturnedUserDto)) // Transform the response to the ReturnedUserDto
  @ApiOperation({ summary: 'Get all user records with optional class' })
  @ApiResponse({ status: 200, description: 'Successful retrieval list of users records.', type: ReturnedUserDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findAll(@Query('classCategory') classCategory?: string): Promise<User[]> {
    return await this.userService.findAll(classCategory);
  }

  // GET /user/:id - get user by id
  @Get(':id')
  @ApiParam({ name: 'id', description: 'User ID', type: String, required: false }) // Path parameter for user id
  @UseInterceptors(new TransformInterceptor(ReturnedUserDto)) // Transform the response to the ReturnedUserDto
  @ApiOperation({ summary: 'Get user by id if admin and if user get own details without id' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of user record.', type: ReturnedUserDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findOne(@Req() req: any, @Param('id') id?: string) : Promise<User> {
    id = req.user.type === 'user' ? req.user._id : id;
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedUserDto)) // Transform the response to the ReturnedUserDto
  @ApiOperation({ summary: 'Update user by id details by admin' })
  @ApiResponse({ status: 200, description: 'Successful update of user record.', type: ReturnedUserDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async update(@Param('id') id: string, @Body() updateUserByAdminDto: UpdateUserByAdminDto) : Promise<User> {
    return await this.userService.update(id, updateUserByAdminDto);
  }

  @Delete(':id')
  @UserType('admin') // Check if the user type is admin
  @ApiOperation({ summary: 'Delete user by id by admin' })
  @ApiResponse({ status: 200, description: 'Successful deletion of user record.' })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async remove(@Param('id') id: string) : Promise<{ message: string }> {
    return await this.userService.remove(id);
  }
}
