import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReturnedAdminDto } from './dto/returned-admin.dto';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';
import { Admin } from './schemas/admin.schema';
import { UserType } from '../common/decorators/userType-guard.decorator';
/* Admin Controller with CRUD operations
    Attributes:
      adminService: Service for admin operations
    Methods:
      -create (POST): Create a new admin account
      -findAll (GET): Get all admins records
      -findOne (GET): Get admin by id
      -remove (DELETE): Delete admin by id
*/
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  // Inject the AdminService to the AdminController
  constructor(private readonly adminService: AdminService) {}

  // POST /admin - create a new admin account
  @Post()
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedAdminDto)) // Transform the response to the ReturnedAdminDto
  @ApiOperation({ summary: 'Create a new admin account' })
  @ApiResponse({ status: 200, description: 'Successful create a new admin record.', type: ReturnedAdminDto })
  @ApiErrorResponses([400, 401, 404, 409, 500]) // Custom error responses Swagger decorator
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminService.create(createAdminDto);
  }

  // GET /admin - get all admins records
  @Get()
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedAdminDto)) // Transform the response to the ReturnedAdminDto
  @ApiOperation({ summary: 'Get all admins records' })
  @ApiResponse({ status: 200, description: 'Successful retrieval list of admins records.', type: ReturnedAdminDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findAll(): Promise<Admin[]> {
    return await this.adminService.findAll();
  }

  // GET /admin/:id - get admin by id
  @Get(':id')
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedAdminDto)) // Transform the response to the ReturnedAdminDto
  @ApiOperation({ summary: 'Get admin using id' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of admin record.', type: ReturnedAdminDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findOne(@Param('id') id: string) {
    return await this.adminService.findOne(id);
  }

  // DELETE /admin/:id - delete admin by id
  @Delete(':id')
  @UserType('admin') // Check if the user type is admin
  @ApiOperation({ summary: 'Delete admin using id' })
  @ApiResponse({ status: 200, description: 'Successful delete admin from records.'})
  @ApiErrorResponses([400, 401, 404, 500])
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.adminService.remove(id);
  }
}
