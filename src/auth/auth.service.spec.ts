import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AdminService } from '../admin/admin.service';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  // Define a variable of type AuthService
  let authService: AuthService;
  let loginDto: LoginDto;
  // Create a mock AdminService
  const mockAdminService = {
    findOneByEmail: jest.fn(),
  };
  // Create a mock UserService
  const mockUserService = {
    findOneByEmail: jest.fn(),
  };
  // Create a mock PasswordService
  const mockPasswordService = {
    comparePassword: jest.fn(),
  };
  // Create a mock JwtService
  const mockJwtService = {
    signAsync: jest.fn(),
  };
  // Before each test, create a new TestingModule
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        { provide: AdminService, useValue: mockAdminService },
        { provide: UserService, useValue: mockUserService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: JwtService, useValue: mockJwtService },
      ]
    }).compile();
    // Get the AuthService from the module
    authService = module.get<AuthService>(AuthService);
    // Create a new LoginDto object
    loginDto = {
      email: 'test@example',
      password: 'password',
    };
  });

  // After each test, reset the mocks
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });


  // Test the login method
  describe('login', () => {
    // Success scenario for login method with type 'admin'
    it('should return a token when login is successful', async () => {
      // Mock the all necessary methods to return the expected values
      mockAdminService.findOneByEmail.mockResolvedValue({
        ...loginDto, _id: '1',
      });
      mockPasswordService.comparePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token');
      // Call the login method with the loginDto and type 'admin'
      const result = await authService.login(loginDto, 'admin');
      // Expect the result to be as expected
      expect(result).toBe('token');
      expect(mockAdminService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockPasswordService.comparePassword).toHaveBeenCalledWith('password', loginDto.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ _id: '1', email: loginDto.email, type: 'admin' });
      expect(mockUserService.findOneByEmail).not.toHaveBeenCalled();
    });

    // Success scenario for login method with type 'user'
    it('should return a token when login is successful', async () => {
      // Mock the all necessary methods to return the expected values
      mockUserService.findOneByEmail.mockResolvedValue({
        ...loginDto, _id: '1',
      });
      mockPasswordService.comparePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token');
      // Call the login method with the loginDto and type 'user'
      const result = await authService.login(loginDto, 'user');
      // Expect the result to be as expected
      expect(result).toBe('token');
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockPasswordService.comparePassword).toHaveBeenCalledWith('password', loginDto.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ _id: '1', email: loginDto.email, type: 'user' });
      expect(mockAdminService.findOneByEmail).not.toHaveBeenCalled();
    });

    // Failure scenario for login method with type 'admin' when user not found
    it('should throw an error when user is not found', async () => {
      // Mock the findOneByEmail method to return undefined
      mockAdminService.findOneByEmail.mockImplementation(() => { throw new NotFoundException; });
      // Call the login method with the loginDto and type 'admin'
      await expect(authService.login(loginDto, 'admin')).rejects.toThrow(new NotFoundException('Invalid credentials'));
      // Expect the findOneByEmail method to be called with the email
      expect(mockAdminService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    // Failure scenario for login method with type 'user' when user not found
    it('should throw an error when user is not found', async () => {
      // Mock the findOneByEmail method to return undefined
      mockUserService.findOneByEmail.mockImplementation(() => { throw new NotFoundException; });
      // Call the login method with the loginDto and type 'user'
      await expect(authService.login(loginDto, 'user')).rejects.toThrow(new NotFoundException('Invalid credentials'));
      // Expect the findOneByEmail method to be called with the email
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    // Failure scenario for login method when password is invalid
    it('should throw an error when password is invalid', async () => {
      // Mock the necessary methods to return the expected values
      mockAdminService.findOneByEmail.mockResolvedValue({
        ...loginDto, _id: '1',
      });
      mockPasswordService.comparePassword.mockResolvedValue(false);
      // Call the login method with the loginDto and type 'admin'
      await expect(authService.login(loginDto, 'admin')).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
      // Expect the comparePassword method to be called with the password
      expect(mockAdminService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockPasswordService.comparePassword).toHaveBeenCalledWith('password', loginDto.password);
    });

    // Failure scenario for login method when other error occurs
    it('should throw an error when other error occurs', async () => {
      // Mock the necessary methods to throw an error
      mockAdminService.findOneByEmail.mockRejectedValue(new Error());
      // Call the login method with the loginDto and type 'admin'
      await expect(authService.login(loginDto, 'admin')).rejects
        .toThrow(new InternalServerErrorException('An error occurred while logging in'));
      // Expect the findOneByEmail method to be called with the email
      expect(mockAdminService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
    });
  });
});
