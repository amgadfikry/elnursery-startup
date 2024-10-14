import { Injectable, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PasswordService } from '../password/password.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AdminService } from '../admin/admin.service';
import { UserService } from '../user/user.service';

// AuthService class that contains authentication logic
@Injectable()
export class AuthService {
  // Inject the Admin model, PasswordService, and JwtService into the AuthService
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  /* login method that takes in a loginDto and type as arguments and returns a token
      Parameters:
        - loginDto: LoginDto
        - type: 'admin' | 'user'
      Returns:
        - token: string
      Errors:
        - UnauthorizedException: 'Invalid credentials'
        - 
  */
  async login(loginDto: LoginDto, type: 'admin' | 'user') {
    try {
      // destructure email and password from loginDto
      const { email, password } = loginDto;
      // determine the model based on the type (admin or user)
      const service: AdminService | UserService = type === 'admin' ? this.adminService : this.userService;
      // find user or admin by email in the database
      const user = await service.findOneByEmail(email);
      // check if password is valid and compare password with hashed password in the database
      const IsValidPassword = await this.passwordService.comparePassword(password, user.password);
      if (!IsValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // create a payload with user id, email, and type and sign the payload with jwt
      const payload = { _id: user._id.toString(), email: user.email, type };
      const token = await this.jwtService.signAsync(payload);
      return token;
    } 
    catch (error) {
      if (error instanceof UnauthorizedException || NotFoundException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException('An error occurred while logging in');
    }
  }
}
