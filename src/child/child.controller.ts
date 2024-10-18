import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req } from '@nestjs/common';
import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserType } from '../common/decorators/userType-guard.decorator';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ReturnedChildDto } from './dto/returned-child.dto';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';
import { Child } from './schemas/child.schema';

/* ChildController with CRUD operations
    Attributes:
      - childService: Service for child operations
    Methods:
      -create (POST): Create a new child record
      -findAll (GET): Get all child records
      -findOne (GET): Get child by id
      -update (PATCH): Update child by id
      -remove (DELETE): Delete child by id
*/
@ApiTags('Child')
@Controller('child')
export class ChildController {
  // Inject the ChildService to the ChildController
  constructor(private readonly childService: ChildService) {}

  // POST /child - create a new child record
  @Post()
  @UserType('user') // Check if the user type is user
  @UseInterceptors(new TransformInterceptor(ReturnedChildDto)) // Use TransformInterceptor to transform the response
  @ApiOperation({ summary: 'Create a new child record' })
  @ApiResponse({ status: 200, description: 'Successful create a new child record.', type: ReturnedChildDto })
  @ApiErrorResponses([400, 401, 404, 409, 500]) // Custom error responses Swagger decorator
  async create(@Body() createChildDto: CreateChildDto, @Req() req: any): Promise<Child> {
    const parentID = req.user._id;
    return await this.childService.create(createChildDto, parentID);
  }

  // GET /child - get all child records
  @Get()
  @UserType('admin') // Check if the user type is admin
  @UseInterceptors(new TransformInterceptor(ReturnedChildDto)) // Use TransformInterceptor to transform the response
  @ApiOperation({ summary: 'Get all child records' })
  @ApiResponse({ status: 200, description: 'Successful retrieval list of child records.', type: ReturnedChildDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findAll() : Promise<Child[]> {
    return await this.childService.findAll();
  }

  // GET /child/:id - get child by id
  @Get(':id')
  @UseInterceptors(new TransformInterceptor(ReturnedChildDto)) // Use TransformInterceptor to transform the response
  @ApiOperation({ summary: 'Get child by id' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of child record.', type: ReturnedChildDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findOne(@Param('id') id: string) : Promise<Child> {
    return await this.childService.findOne(id);
  }

  // DELETE /child/:id - delete child by id
  @Delete(':id')
  @UserType('admin') // Check if the user type is admin
  @ApiOperation({ summary: 'Delete child by id' })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async remove(@Param('id') id: string) : Promise<{ message: string }> {
    return await this.childService.remove(id);
  }
}
