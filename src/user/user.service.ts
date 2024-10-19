import { Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { ClientSession, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordService } from '../password/password.service';
import { User, UserDocument } from './schemas/user.schema';
import { EmailService } from '../common/email.service';
import { TransactionService } from '../transaction/transaction.service';

/* User Service with methods for CRUD operations
    Attributes:
      userModel: Model for User schema
    Methods:
      -create: Create a new user account
      -findAll: Get all user records
      -findOne: Get user by id
      -update: Update user by id
      -remove: Delete user by id
*/
@Injectable()
export class UserService {
  // Inject the User model, PasswordService, EmailService and TransactionService
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => PasswordService)) private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
    private readonly transactionService: TransactionService,
  ) {}

  /* create method to create a new user account
    Parameters:
      -createUserDto: CreateUserDto object
    Returns:
      -Promise<User>: User object
    Throws:
      -ConflictException: If user already exists
      -InternalServerErrorException: If error occurs while saving user
  */
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.transactionService.withTransaction(async (session) => {
      try {
        // generate a random password for the user account
        const password = this.passwordService.generateRandomPassword();
        const hashPassword = await this.passwordService.hashPassword(password);
        // create a new user object
        const userData = { ...createUserDto, password: hashPassword };
        const newUser = new this.userModel(userData);
        const createdUser = await newUser.save({ session });
        // send account credentials email to the user
        await this.emailService.sendAccountCredentials(createdUser.name, createdUser.email, password);
        return createdUser;
      } catch (error) {
        if (error.code === 11000) {
          throw new ConflictException('User already exists');
        } else {
          throw new InternalServerErrorException('An Error occurred while creating the user');
        }
      }
    });
  }

  /* Get all users with optional classCategory and return the list of users
      Parameters:
        - classCategory: Optional class category
      Returns:
        - list of users records in User format
      Errors:
        - InternalServerErrorException: An error occurred while Getting the list of users
  */
  async findAll(classCategory?: string): Promise<User[]> {
    try {
      const classData = classCategory ? { class: classCategory } : {};
      const users = await this.userModel.find(classData).exec();
      return users;
    } catch (error) {
      throw new InternalServerErrorException('An Error occurred while Getting the list of users');
    }
  }

  /* Get user by id and return the user details
      Parameters:
        - id: user id
      Returns:
        - user details in User format
      Errors:
        - NotFoundException: If user with the id does not exist
        - InternalServerErrorException: An error occurred while Getting the user details
  */
  async findOne(id: string) : Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('An Error occurred while Getting the user details');
    }
  }

  /* Update user by id
      Parameters:
        - id: user id
        - updateUserDto: UpdateUserDto object
        - session: ClientSession (optional)
      Returns:
        - user details in User format
  */
  async update(id: string, updateUserByAdminDto: UpdateUserByAdminDto, session: ClientSession = null) : Promise<User> {
    try {
      // find the user by id and update the user details
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserByAdminDto, { new: true, session }).exec();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      throw new InternalServerErrorException('An Error occurred while Updating the user details');
    }
  }

  /* Delete user by id
      Parameters:
        - id: user id
        - session: ClientSession (optional
      Returns:
        - message: string
      Errors:
        - NotFoundException: If user with the id does not exist
        - InternalServerErrorException: An error occurred while Deleting the user
  */
  async remove(id: string, session: ClientSession = null) : Promise<{ message: string }> {
    try {
      const user = await this.userModel.findByIdAndDelete(id, { session }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while Deleting the user');
    }
  }

  /* findOneByEmail method to find user by email
    Parameters:
      - email: string
    Returns:
      - user: User object
    Errors:
      - NotFoundException: If user with the email not found
      - InternalServerErrorException: An error occurred while Getting the user details
  */
  async findOneByEmail(email: string) : Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while Getting the user details');
    }
  }

  /* updateWithoutDtoById method to update user by id without dto
    Parameters:
      - id: string
      - data: any
      - session: ClientSession (optional)
    Returns:
      - user: User object
    Errors:
      - NotFoundException: If user with the id not found
      - InternalServerErrorException: An error occurred while Updating the user details
  */
  async updateWithoutDtoById(id: string, data: Object, session: ClientSession = null) : Promise<UserDocument> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, data, { new: true, session }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while Updating the user details');
    }
  }

  /* updateWithoutDtoByFields method to update user by fields without dto
    Parameters:
      - fields: object
      - data: any
      - session: ClientSession (optional)
    Returns:
      - user: User object
    Errors:
      - NotFoundException: If user with the fields not found
      - InternalServerErrorException: An error occurred while Updating the user details
  */
  async updateWithoutDtoByFields(fields: object, data: Object, session: ClientSession = null) : Promise<UserDocument> {
    try {
      const user = await this.userModel.findOneAndUpdate(fields, data, { new: true, session }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while Updating the user details');
    }
  }

  /* deactivateExpiredUsers method to deactivate users whose activation has expired
    Parameters:
      - minAgo: Date object
      - session: ClientSession (optional)
    Returns:
      - message: string
  */
  async deactivateExpiredUsers(dateAgo: Date, session: ClientSession = null) : Promise<{ message: string }> {
    try {
      // find users whose activation has expired and deactivate them
      const users = await this.userModel.updateMany(
        { isActive: true, lastActivatedDate: { $lte: dateAgo } },
        { isActive: false },
        { session }
      ).exec();
      // return message of number of users deactivated
      return { message: `Number of users deactivated: ${users.modifiedCount}` };
    } catch (error) {
      throw new InternalServerErrorException('An Error occurred while deactivating users');
    }
  }

  /* addChild method to add child to the parent's children array
    Parameters:
      - parentID: string
      - childID: string
      - session: ClientSession (optional)
    Returns:
      - message: string
  */
  async addChild(parentID: string, childId: String, session: ClientSession = null) : Promise<{ message: string }> {
    try {
      // add child ID to the parent's children array
      const user = await this.userModel.findByIdAndUpdate(parentID, { $push: { childrenList: childId } }, { new: true, session });
      // check if parent exists throw error if not
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.childrenList.length > user.children) {
        throw new BadRequestException('Maximum number of children reached');
      }
      return { message: 'Child added successfully' };
    } catch (error) {
      // if validation error occurs, return error message
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while adding child');
    }
  }

  /* removeChild method to remove child from the parent's children array
    Parameters:
      - parentID: string
      - childID: string
      - session: ClientSession (optional)
    Returns:
      - message: string
  */
  async removeChild(parentID: string, childID: string, session: ClientSession = null) : Promise<{ message: string }> {
    try {
      // remove child ID from the parent's children array
      const user = await this.userModel.findByIdAndUpdate(parentID, { $pull: { childrenList: childID } }, { new: true, session });
      // check if parent exists throw error if not
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return { message: 'Child removed successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An Error occurred while removing child');
    }
  }
}
