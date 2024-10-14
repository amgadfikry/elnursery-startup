import { 
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordService } from 'src/password/password.service';
import { EmailService } from 'src/common/email.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { ClientSession } from 'mongoose';

/* Admin Service with methods for CRUD operations
    Attributes:
      adminModel: Model for Admin schema
    Methods:
      -create: Create a new admin account
      -findAll: Get all admins records
      -findOne: Get admin by id
      -remove: Delete admin by id
*/
@Injectable()
export class AdminService {
  // Inject the Admin model, PasswordService, EmailService and TransactionService
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @Inject(forwardRef(() => PasswordService)) private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
    private readonly transactionService: TransactionService,
  ) {}

  /* Create a new admin account and return the created admin
      Parameters:
        - createAdminDto: admin details to create a new admin
      Returns:
        - created admin details in ReturnedAdminDto format
      Errors:
        - ConflictException: If admin with the email already exist
        - InternalServerErrorException: An error occurred while creating the admin
  */
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.transactionService.withTransaction(async (session) => {
      try {
        // generate a random password for the admin account
        const password = this.passwordService.generateRandomPassword();
        const hashPassword = await this.passwordService.hashPassword(password);
        // create a new admin object and save it
        const adminData = { ...createAdminDto, password: hashPassword };
        const newAdmin = new this.adminModel(adminData);
        const createdAdmin = await newAdmin.save({ session });
        // send account credentials email to the admin
        await this.emailService.sendAccountCredentials(createAdminDto.name, createAdminDto.email, password);
        return createdAdmin;
      } catch (error) {
        if (error.code === 11000) {
          throw new ConflictException("Admin with this email already exist");
        }
        throw new InternalServerErrorException('An Error occurred while creating the admin');
      }
    });
  }

  /* Get all admins records and return the list of admins
      Returns:
        - list of admins records in ReturnedAdminDto format
      Errors:
        - InternalServerErrorException: An error occurred while Getting the list of admins
  */
  async findAll(): Promise<Admin[]> {
    try {
      const admins = await this.adminModel.find().exec();
      return admins;
    } catch (error) {
      throw new InternalServerErrorException('An Error occurred while Getting the list of admins');
    }
  }

  /* Get admin by id and return the admin details
      Parameters:
        - id: admin id to get the admin details
      Returns:
        - admin details in ReturnedAdminDto format
      Errors:
        - NotFoundException: If admin with the id not found
        - InternalServerErrorException: An error occurred while Getting the admin details
  */
  async findOne(id: string): Promise<Admin> {
    try {
      const admin = await this.adminModel.findById(id).exec();
      if (!admin) {
        throw new NotFoundException(`Admin not found`);
      }
      return admin;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while Getting the admin details');
    }
  }

  /* Delete admin by id
      Parameters:
        - id: admin id to delete
        - session: ClientSession (optional)
      Returns:
        - message: success message after deleting the admin
      Errors:
        - NotFoundException: If admin with the id not found
        - InternalServerErrorException: An error occurred while delete admin record
        - BadRequestException: You cannot delete the owner account
  */
  async remove(id: string, session: ClientSession = null): Promise<{ message: string }> {
    try {
      // get the admin details by id to check if the admin exist
      const user = await this.adminModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`Admin not found`);
      }
      // check if the user is trying to delete the owner account
      if (user.roles.includes('owner')) {
        throw new BadRequestException('You cannot delete the owner account');
      }
      // delete the admin record
      const result = await this.adminModel.deleteOne({ _id: id }, { session }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Admin not found`);
      }
      // return success message after deleting the admin
      return { message: 'Successfully deleted admin from records' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while delete admin record');
    }
  }

  /* findOneByEmail method that takes in an email and returns an admin
      Parameters:
        - email: string
      Returns:
        - admin: Admin document
      Errors:
        - NotFoundException: 'Admin not found'
        - InternalServerErrorException: 'An error occurred while finding admin by email'
  */
  async findOneByEmail(email: string): Promise<AdminDocument> {
    try {
      const admin = await this.adminModel.findOne({ email }).exec();
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return admin;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while finding admin by email');
    }
  }

  /* updateWithoutDtoById method that takes in an id and an update object and returns the updated admin
      Parameters:
        - id: string
        - update: object
        - session: ClientSession (optional)
      Returns:
        - updatedAdmin: Admin document
      Errors:
        - NotFoundException: 'Admin not found'
        - InternalServerErrorException: 'An error occurred while updating admin'
  */
  async updateWithoutDtoById(id: string, update: Object, session: ClientSession = null): Promise<AdminDocument> {
    try {
      const updatedAdmin = await this.adminModel.findByIdAndUpdate(id, update, { new: true, session }).exec();
      if (!updatedAdmin) {
        throw new NotFoundException('Admin not found');
      }
      return updatedAdmin;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while updating admin');
    }
  }

  /* updateWithoutDtoByFields method that takes in a field and an update object and returns the updated admin
      Parameters:
        - field: object
        - update: object
        - session: ClientSession (optional)
      Returns:
        - updatedAdmin: Admin document
      Errors:
        - NotFoundException: 'Admin not found'
        - InternalServerErrorException: 'An error occurred while updating admin'
  */
  async updateWithoutDtoByFields(field: Object, update: Object, session: ClientSession = null): Promise<AdminDocument> {
    try {
      const updatedAdmin = await this.adminModel.findOneAndUpdate(field, update, { new: true, session }).exec();
      if (!updatedAdmin) {
        throw new NotFoundException('Admin not found');
      }
      return updatedAdmin;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while updating admin');
    }
  }
}
