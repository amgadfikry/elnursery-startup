import { 
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailService } from '../common/email.service';
import { ChangePasswordTokenDto } from './dto/change-password-token.dto';
import { AdminService } from 'src/admin/admin.service';
import { UserService } from 'src/user/user.service';
import { TransactionService } from 'src/transaction/transaction.service';

// This service is responsible for hashing passwords, changing passwords, and resetting passwords.
@Injectable()
export class PasswordService {
  // Inject the Admin model, PasswordService, EmailService and TransactionService
  constructor(
    @Inject(forwardRef(() => AdminService)) private readonly adminService: AdminService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly transactionService: TransactionService,
  ) {}

  /* hashPassword is a method that takes a password and hashes it using bcrypt.
      Parameters:
      - password: string
      Returns:
        - hashed password: string
  */
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(error);
    }
  }

  /* comparePassword is a method that takes a password and a hashed password and compares them.
      Parameters:
      - password: string
      - hashedPassword: string
      Returns:
        - boolean
  */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(error);
    }
  }

  /* generateRandomPassword is a method that generates a random password using the generate-password library.
      Returns:
        - random password: string
  */
  generateRandomPassword(): string {
    const password = generator.generate({
      length: 10,
      numbers: true,
      lowercase: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
      exclude: '()[]{}<>:;.,?/!%^"\'\\',
    });
    return password;
  }

  /* changePassword is a method that takes a user's old password, new password, and confirm password and changes the password.
      Parameters:
      - changePasswordDto: ChangePasswordDto
      - id: string
      - userType: string
      Returns:
        - "password changed successfully" message: string
      Errors:
        -InternalServerErrorException: if an error occurs
        - BadRequestException: if the old password is incorrect
  */
  async changePassword(changePasswordDto: ChangePasswordDto, id: string, userType: string): Promise<string> {
    try {
      // Extract oldPassword and newPassword from changePasswordDto
      const { oldPassword, newPassword } = changePasswordDto;
      // Check if the userType is admin or user and get the service accordingly
      const service: AdminService | UserService = userType === 'admin' ? this.adminService : this.userService;
      // Find the user by 
      const user = await service.findOne(id);
      // Compare the old password with the hashed password
      const isPasswordValid = await this.comparePassword(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }
      // Hash the new password and update the user's password
      const hashedPassword = await this.hashPassword(newPassword);
      await service.updateWithoutDtoById(id, { password: hashedPassword, changePassword: true });
      return 'Password changed successfully';
    } catch (error) {
      // throw error if an error failed to change password
      if (error instanceof BadRequestException || NotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException("Couldn't change password");
    }
  }

  /* resetPassword is a method that takes a user's email and generate code and send it to email.
      - email: string
      - userType: string
      Returns:
        - success message: string
      Errors:
        - NotFoundException: if the user is not found
        - InternalServerErrorException: if an error occurs
  */
  async resetPassword(email: string, userType: string): Promise<{ message: string }> {
    return this.transactionService.withTransaction(async (session) => {
      try {
        // Check if the userType is admin or user and get the service accordingly
        const service: AdminService | UserService = userType === 'admin' ? this.adminService : this.userService;
        const user = await service.findOneByEmail(email);
        // Generate a random code form of 6 numbers
        const code = Math.floor(100000 + Math.random() * 900000);
        // add code to token in database and expire date after 1 hour
        await service.updateWithoutDtoByFields(
          { email },
          { forgetPasswordToken: code, forgetPasswordTokenExpiry: new Date(Date.now() + 3600000) },
          session
        );
        // send password reset email
        await this.emailService.sendPasswordResetEmail(user.name, email, code);
        return { message: 'Password reset email sent successfully' };
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException("Couldn't reset password");
      }
    });
  }

  /* changePasswordByToken is a method that takes a user's email, code, and new password and changes the password.
      Parameters:
      - email: string
      - code: number
      - newPassword: string
      - userType: string
      Returns:
        - "password changed successfully" message: string
      Errors:
        - NotFoundException: if the user is not found
        - BadRequestException: if the code is incorrect
        - InternalServerErrorException: if an error occurs
  */
  async changePasswordByToken(email: string, changePasswordTokenDto: ChangePasswordTokenDto, userType: string): Promise<{ message: string }> {
    try {
      const {code, newPassword} = changePasswordTokenDto;
      // Check if the userType is admin or user and get the service accordingly
      const service: AdminService | UserService = userType === 'admin' ? this.adminService : this.userService;
      // Find the user by email and check if the user exists
      const user = await service.findOneByEmail(email);
      // Check if the code is correct or code is expired
      if (user.forgetPasswordToken !== code || user.forgetPasswordTokenExpiry < new Date()) {
        throw new BadRequestException('Code is incorrect or expired');
      }
      // Hash the new password and update the user's password
      const hashedPassword = await this.hashPassword(newPassword);
      await service.updateWithoutDtoByFields(
        { email },
        { password: hashedPassword, forgetPasswordToken: null, forgetPasswordTokenExpiry: null }
      )
      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Couldn't change password");
    }
  }
}
