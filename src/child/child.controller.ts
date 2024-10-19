import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req } from '@nestjs/common';
import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new child record and assign to parent (user only)' })
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
  @ApiOperation({ summary: 'Get list of all children (admin only)' })
  @ApiResponse({ status: 200, description: 'Successful retrieval list of child records.', type: ReturnedChildDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findAll() : Promise<Child[]> {
    return await this.childService.findAll();
  }

  // GET /child/:id - get child by id
  @Get(':id')
  @UseInterceptors(new TransformInterceptor(ReturnedChildDto)) // Use TransformInterceptor to transform the response
  @ApiOperation({ summary: 'Get a child data details by id (admin/user)' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of child record.', type: ReturnedChildDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findOne(@Param('id') id: string) : Promise<Child> {
    return await this.childService.findOne(id);
  }

  // Get /child/parent/parentID - get all children of a parent
  @Get('parent/:parentID')
  @ApiParam({ name: 'parentID', description: 'Parent ID', type: String, required: false }) // Path parameter for parent id
  @UseInterceptors(new TransformInterceptor(ReturnedChildDto)) // Use TransformInterceptor to transform the response
  @ApiOperation({ summary: 'Get all children of a parent by parent id or current parent (admin/user)' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of children of a parent.', type: ReturnedChildDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async findChildrenByParent(@Req() req: any, @Param('parentID') parentID?: string) : Promise<Child[]> {
    const id = req.user.type === 'user' ? req.user._id : parentID;
    return await this.childService.findAllByParent(id);
  }

  // PATCH /child/:id - update child by id
  @Patch(':id')
  @UserType('user') // Check if the user type is user
  @UseInterceptors(new TransformInterceptor(ReturnedChildDto)) // Use TransformInterceptor to transform the response
  @ApiOperation({ summary: 'Update child data details by id (user only)' })
  @ApiResponse({ status: 200, description: 'Successful update of child record.', type: ReturnedChildDto })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async update(@Param('id') id: string, @Body() updateChildDto: UpdateChildDto) : Promise<Child> {
    return await this.childService.update(id, updateChildDto);
  }

  // DELETE /child/:id - delete child by id
  @Delete(':id')
  @UserType('admin') // Check if the user type is admin
  @ApiOperation({ summary: 'Delete a child data by id (admin only)' })
  @ApiErrorResponses([400, 401, 404, 500]) // Custom error responses Swagger decorator
  async remove(@Param('id') id: string) : Promise<{ message: string }> {
    return await this.childService.remove(id);
  }


}
