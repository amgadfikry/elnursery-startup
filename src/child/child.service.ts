import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Child, ChildDocument } from './schemas/child.schema';
import { UserService } from '../user/user.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class ChildService {
  // Inject all neccessary services and models
  constructor(
    @InjectModel(Child.name) private childModel: Model<ChildDocument>,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService
  ) {}

  /* create method to create a new child record and associate it with a parent
    Parameters:
      -createChildDto: CreateChildDto object
      - parentID: Parent ID
    Returns:
      - Created child Document
    Errors:
      - InternalServerErrorException: If error occurs while saving child
  */
  async create(createChildDto: CreateChildDto, parentID: string): Promise<Child> {
    return this.transactionService.withTransaction(async (session) => {
      try {
        // add parenet ID to the child object
        const childData = { ...createChildDto, parentID };
        // create a new child object
        const newChild = await this.childModel.create([childData], { session });
        // add child ID to the parent's children array
        const childObj = { name: newChild[0].name, id: newChild[0]._id.toString() };
        await this.userService.addChild(parentID, childObj, session);
        // return the created child
        return newChild[0];
      } catch (error) {
        throw error;
      }
    });
  }

  /* findAll method to get all child records
    Returns:
      - All child records
    Errors:
      - InternalServerErrorException: If error occurs while fetching child records
  */
  async findAll() : Promise<Child[]> {
    try {
      return await this.childModel.find();
    } catch (error) {
      throw new InternalServerErrorException('Error occurred while fetching child records');
    }
  }

  /* findOne method to get a child record by ID
    Parameters:
      - id: Child ID
    Returns:
      - Child record
    Errors:
      - InternalServerErrorException: If error occurs while fetching child record
      - NotFoundException: If child record not found
  */
  async findOne(id: string) : Promise<Child> {
    try {
      const child = await this.childModel.findById(id);
      if (!child) {
        throw new NotFoundException('Child record not found');
      }
      return child;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error occurred while fetching child record');
    }
  }

  /* update method to update a child record
    Parameters:
      - id: Child ID
      - updateChildDto: UpdateChildDto object
      - session: ClientSession (optional)
    Returns:
      - Updated child record
    Errors:
      - InternalServerErrorException: If error occurs while updating child record
      - NotFoundException: If child record not found
  */
  async update(id: string, updateChildDto: UpdateChildDto, session: ClientSession = null) : Promise<Child> {
    try {
      const updatedChild = await this.childModel.findByIdAndUpdate(id, updateChildDto, { new: true, session });
      if (!updatedChild) {
        throw new NotFoundException('Child record not found');
      }
      return updatedChild;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error occurred while updating child record');
    }
  }

  /* remove method to remove a child record
    Parameters:
      - id: Child ID
    Returns:
      - Success message
    Errors:
      - InternalServerErrorException: If error occurs while removing child record
      - NotFoundException: If child record not found
  */
  async remove(id: string) : Promise<{ message: string }> {
    return this.transactionService.withTransaction(async (session) => {
      try {
        // remove child record
        const child = await this.childModel.findByIdAndDelete(id, { session });
        if (!child) {
          throw new NotFoundException('Child record not found');
        }
        // remove child ID from parent's children array
        await this.userService.removeChild(child.parentID, id, session);
        return { message: 'Child record deleted successfully' };
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Error occurred while removing child record');
      }
    });
  }
}
